/**
 * Task Queue Service
 * BullMQ-based task queue for agent orchestration
 */

import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { redisService } from './redis.service.js';
import { config } from '@/utils/config.js';
import logger, { agentLogger } from '@/utils/logger.js';
import type { AgentTaskRequest, TaskQueueJob } from '@/types/index.js';

export class QueueService {
  private queue: Queue<TaskQueueJob>;
  private worker: Worker<TaskQueueJob>;
  private queueEvents: QueueEvents;
  private isInitialized: boolean = false;

  constructor() {
    const connection = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db,
    };

    // Create queue
    this.queue = new Queue<TaskQueueJob>('agent-tasks', {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          count: 100, // Keep last 100 completed jobs
          age: 24 * 3600, // Keep for 24 hours
        },
        removeOnFail: {
          count: 50, // Keep last 50 failed jobs
          age: 7 * 24 * 3600, // Keep for 7 days
        },
      },
    });

    // Create worker (processor will be set later)
    this.worker = new Worker<TaskQueueJob>(
      'agent-tasks',
      async (job) => this.processTask(job),
      {
        connection,
        concurrency: config.openhands.maxConcurrentAgents,
        limiter: {
          max: 100, // Max 100 jobs
          duration: 60000, // per minute
        },
      }
    );

    // Create queue events for monitoring
    this.queueEvents = new QueueEvents('agent-tasks', { connection });

    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for queue monitoring
   */
  private setupEventHandlers(): void {
    // Queue events
    this.queueEvents.on('completed', ({ jobId, returnvalue }) => {
      logger.debug('Job completed', { jobId, returnvalue });
    });

    this.queueEvents.on('failed', ({ jobId, failedReason }) => {
      logger.error('Job failed', { jobId, failedReason });
    });

    this.queueEvents.on('progress', ({ jobId, data }) => {
      logger.debug('Job progress', { jobId, progress: data });
    });

    // Worker events
    this.worker.on('ready', () => {
      this.isInitialized = true;
      logger.info('Queue worker ready');
    });

    this.worker.on('error', (error) => {
      logger.error('Queue worker error', { error });
    });

    this.worker.on('stalled', (jobId) => {
      logger.warn('Job stalled', { jobId });
    });
  }

  /**
   * Add task to queue
   */
  async addTask(
    taskId: string,
    request: AgentTaskRequest,
    priority?: number
  ): Promise<Job<TaskQueueJob>> {
    if (!redisService.ready()) {
      throw new Error('Redis not ready');
    }

    const jobData: TaskQueueJob = {
      taskId,
      request,
      retryCount: 0,
      maxRetries: 3,
    };

    const job = await this.queue.add(taskId, jobData, {
      jobId: taskId,
      priority: priority || request.priority || 5,
    });

    agentLogger.taskQueued(taskId);
    return job;
  }

  /**
   * Process task (this will be overridden by agent orchestrator)
   */
  private async processTask(job: Job<TaskQueueJob>): Promise<any> {
    const { taskId, request } = job.data;

    agentLogger.taskStarted(taskId, 'pending-container');

    // Update progress
    await job.updateProgress(0);

    // This is a placeholder - actual processing will be done by agent orchestrator
    logger.info('Processing task', { taskId, taskType: request.taskType });

    return { success: true, taskId };
  }

  /**
   * Set custom task processor
   */
  setProcessor(processor: (job: Job<TaskQueueJob>) => Promise<any>): void {
    // Replace the worker with a new one using the custom processor
    this.worker.close();

    this.worker = new Worker<TaskQueueJob>(
      'agent-tasks',
      processor,
      {
        connection: {
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
          db: config.redis.db,
        },
        concurrency: config.openhands.maxConcurrentAgents,
      }
    );

    this.setupEventHandlers();
    logger.info('Custom task processor set');
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<any> {
    const job = await this.queue.getJob(taskId);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress;
    const data = job.data;

    return {
      taskId,
      state,
      progress,
      data,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
    };
  }

  /**
   * Cancel task
   */
  async cancelTask(taskId: string): Promise<void> {
    const job = await this.queue.getJob(taskId);
    if (job) {
      await job.remove();
      agentLogger.taskCancelled(taskId);
    }
  }

  /**
   * Get queue metrics
   */
  async getMetrics(): Promise<any> {
    const waiting = await this.queue.getWaitingCount();
    const active = await this.queue.getActiveCount();
    const completed = await this.queue.getCompletedCount();
    const failed = await this.queue.getFailedCount();
    const delayed = await this.queue.getDelayedCount();

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  /**
   * Get active jobs
   */
  async getActiveJobs(): Promise<Job<TaskQueueJob>[]> {
    return this.queue.getActive();
  }

  /**
   * Get waiting jobs
   */
  async getWaitingJobs(): Promise<Job<TaskQueueJob>[]> {
    return this.queue.getWaiting();
  }

  /**
   * Get completed jobs
   */
  async getCompletedJobs(start = 0, end = 10): Promise<Job<TaskQueueJob>[]> {
    return this.queue.getCompleted(start, end);
  }

  /**
   * Get failed jobs
   */
  async getFailedJobs(start = 0, end = 10): Promise<Job<TaskQueueJob>[]> {
    return this.queue.getFailed(start, end);
  }

  /**
   * Clean old jobs
   */
  async cleanJobs(
    grace: number = 24 * 3600 * 1000, // 24 hours in ms
    limit: number = 1000
  ): Promise<void> {
    await this.queue.clean(grace, limit, 'completed');
    await this.queue.clean(grace, limit, 'failed');
    logger.info('Cleaned old jobs', { grace, limit });
  }

  /**
   * Pause queue
   */
  async pause(): Promise<void> {
    await this.queue.pause();
    logger.info('Queue paused');
  }

  /**
   * Resume queue
   */
  async resume(): Promise<void> {
    await this.queue.resume();
    logger.info('Queue resumed');
  }

  /**
   * Check if queue is ready
   */
  ready(): boolean {
    return this.isInitialized && redisService.ready();
  }

  /**
   * Close queue connections
   */
  async close(): Promise<void> {
    logger.info('Closing queue service');
    await this.worker.close();
    await this.queue.close();
    await this.queueEvents.close();
    this.isInitialized = false;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const metrics = await this.getMetrics();
      return metrics !== null && this.isInitialized;
    } catch (error) {
      logger.error('Queue health check failed', { error });
      return false;
    }
  }
}

// Singleton instance
export const queueService = new QueueService();
