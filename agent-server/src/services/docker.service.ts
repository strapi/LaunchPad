/**
 * Docker Service
 * Manages Docker containers for agent execution
 */

import Docker from 'dockerode';
import { config } from '@/utils/config.js';
import logger, { containerLogger } from '@/utils/logger.js';
import { ContainerError } from '@/types/index.js';
import type { ContainerInfo } from '@/types/index.js';

export class DockerService {
  private docker: Docker;
  private activeContainers: Map<string, ContainerInfo>;

  constructor() {
    this.docker = new Docker({ socketPath: config.docker.host });
    this.activeContainers = new Map();
    this.initialize();
  }

  /**
   * Initialize Docker service
   */
  private async initialize() {
    try {
      // Verify Docker is accessible
      await this.docker.ping();
      logger.info('Docker service initialized');

      // Ensure network exists
      await this.ensureNetwork();

      // Clean up any stale containers from previous runs
      await this.cleanupStaleContainers();
    } catch (error) {
      logger.error('Failed to initialize Docker service', { error });
      throw new ContainerError('Docker initialization failed');
    }
  }

  /**
   * Ensure Docker network exists
   */
  private async ensureNetwork(): Promise<void> {
    try {
      const networks = await this.docker.listNetworks({
        filters: { name: [config.docker.network] },
      });

      if (networks.length === 0) {
        await this.docker.createNetwork({
          Name: config.docker.network,
          Driver: 'bridge',
        });
        logger.info('Docker network created', { network: config.docker.network });
      }
    } catch (error) {
      logger.error('Failed to ensure Docker network', { error });
      throw new ContainerError('Docker network setup failed');
    }
  }

  /**
   * Clean up stale containers from previous runs
   */
  private async cleanupStaleContainers(): Promise<void> {
    try {
      const containers = await this.docker.listContainers({
        all: true,
        filters: {
          label: ['app=peter-sung-agent'],
        },
      });

      for (const containerInfo of containers) {
        const container = this.docker.getContainer(containerInfo.Id);
        try {
          await container.stop();
          await container.remove();
          logger.info('Removed stale container', { containerId: containerInfo.Id });
        } catch (error) {
          // Container might already be stopped/removed
          logger.debug('Failed to remove stale container', {
            containerId: containerInfo.Id,
            error,
          });
        }
      }
    } catch (error) {
      logger.warn('Failed to cleanup stale containers', { error });
    }
  }

  /**
   * Create and start a new agent container
   */
  async createContainer(taskId: string, workspacePath: string): Promise<string> {
    try {
      containerLogger.creating(taskId, 'pending');

      const container = await this.docker.createContainer({
        Image: config.docker.agentImage,
        name: `agent-${taskId}`,
        Labels: {
          'app': 'peter-sung-agent',
          'taskId': taskId,
          'createdAt': new Date().toISOString(),
        },
        Env: [
          `WORKSPACE=${workspacePath}`,
          `TASK_ID=${taskId}`,
          `ANTHROPIC_API_KEY=${config.llm.anthropic.apiKey || ''}`,
          `GOOGLE_API_KEY=${config.llm.google.apiKey || ''}`,
          `OPENAI_API_KEY=${config.llm.openai.apiKey || ''}`,
        ],
        HostConfig: {
          NetworkMode: config.docker.network,
          AutoRemove: true,
          Memory: 2 * 1024 * 1024 * 1024, // 2GB
          CpuQuota: 100000, // 1 CPU
          Binds: [`${workspacePath}:/workspace`],
        },
        WorkingDir: '/workspace',
      });

      const containerId = container.id;

      await container.start();
      containerLogger.started(taskId, containerId);

      const containerInfo: ContainerInfo = {
        id: containerId,
        taskId,
        status: 'running',
        createdAt: new Date(),
        resources: {},
      };

      this.activeContainers.set(taskId, containerInfo);

      // Monitor container in background
      this.monitorContainer(taskId, containerId);

      return containerId;
    } catch (error) {
      containerLogger.error(taskId, 'unknown', error as Error);
      throw new ContainerError(
        `Failed to create container for task ${taskId}`,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Stop and remove a container
   */
  async stopContainer(taskId: string): Promise<void> {
    const containerInfo = this.activeContainers.get(taskId);
    if (!containerInfo) {
      logger.warn('Attempted to stop non-existent container', { taskId });
      return;
    }

    try {
      const container = this.docker.getContainer(containerInfo.id);
      await container.stop({ t: 10 }); // 10 second timeout
      containerLogger.stopped(taskId, containerInfo.id);

      this.activeContainers.delete(taskId);
    } catch (error) {
      containerLogger.error(taskId, containerInfo.id, error as Error);
      // Attempt force removal
      try {
        const container = this.docker.getContainer(containerInfo.id);
        await container.remove({ force: true });
      } catch (removeError) {
        logger.error('Failed to force remove container', {
          taskId,
          containerId: containerInfo.id,
          error: removeError,
        });
      }
    }
  }

  /**
   * Get container info
   */
  getContainerInfo(taskId: string): ContainerInfo | undefined {
    return this.activeContainers.get(taskId);
  }

  /**
   * Get all active containers
   */
  getActiveContainers(): ContainerInfo[] {
    return Array.from(this.activeContainers.values());
  }

  /**
   * Monitor container health and resources
   */
  private async monitorContainer(taskId: string, containerId: string): Promise<void> {
    const container = this.docker.getContainer(containerId);

    try {
      const stream = await container.stats({ stream: true });

      stream.on('data', (data) => {
        const stats = JSON.parse(data.toString());

        const containerInfo = this.activeContainers.get(taskId);
        if (containerInfo) {
          // Update resource usage
          const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
          const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
          const cpuUsage = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

          const memoryUsage = (stats.memory_stats.usage / stats.memory_stats.limit) * 100;

          containerInfo.resources = {
            cpuUsage: Math.round(cpuUsage * 100) / 100,
            memoryUsage: Math.round(memoryUsage * 100) / 100,
          };
        }
      });

      stream.on('error', (error) => {
        logger.error('Container stats stream error', { taskId, containerId, error });
      });

      stream.on('end', () => {
        logger.debug('Container stats stream ended', { taskId, containerId });
      });
    } catch (error) {
      logger.error('Failed to monitor container', { taskId, containerId, error });
    }
  }

  /**
   * Execute command in container
   */
  async executeCommand(
    taskId: string,
    cmd: string[]
  ): Promise<{ stdout: string; stderr: string }> {
    const containerInfo = this.activeContainers.get(taskId);
    if (!containerInfo) {
      throw new ContainerError(`Container not found for task ${taskId}`);
    }

    try {
      const container = this.docker.getContainer(containerInfo.id);
      const exec = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const stream = await exec.start({ hijack: true, stdin: false });

      return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        stream.on('data', (chunk: Buffer) => {
          const str = chunk.toString();
          if (chunk[0] === 1) {
            stdout += str.slice(8);
          } else if (chunk[0] === 2) {
            stderr += str.slice(8);
          }
        });

        stream.on('end', () => {
          resolve({ stdout, stderr });
        });

        stream.on('error', reject);
      });
    } catch (error) {
      throw new ContainerError(
        `Failed to execute command in container ${taskId}`,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Clean up all containers (shutdown)
   */
  async cleanup(): Promise<void> {
    logger.info('Cleaning up all containers');

    const tasks = Array.from(this.activeContainers.keys());
    await Promise.all(tasks.map((taskId) => this.stopContainer(taskId)));

    logger.info('Container cleanup complete');
  }
}

// Singleton instance
export const dockerService = new DockerService();
