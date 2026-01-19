/**
 * Redis Service
 * Centralized Redis client with connection management
 */

import { Redis } from 'ioredis';
import { config } from '@/utils/config.js';
import logger from '@/utils/logger.js';

export class RedisService {
  private client: Redis;
  private subscriber: Redis;
  private isReady: boolean = false;

  constructor() {
    this.client = this.createClient('main');
    this.subscriber = this.createClient('subscriber');
    this.initialize();
  }

  /**
   * Create Redis client instance
   */
  private createClient(name: string): Redis {
    const client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    client.on('connect', () => {
      logger.info(`Redis client (${name}) connected`);
    });

    client.on('ready', () => {
      logger.info(`Redis client (${name}) ready`);
      if (name === 'main') {
        this.isReady = true;
      }
    });

    client.on('error', (error) => {
      logger.error(`Redis client (${name}) error`, { error: error.message });
    });

    client.on('close', () => {
      logger.warn(`Redis client (${name}) connection closed`);
      if (name === 'main') {
        this.isReady = false;
      }
    });

    client.on('reconnecting', () => {
      logger.info(`Redis client (${name}) reconnecting`);
    });

    return client;
  }

  /**
   * Initialize Redis connections
   */
  private async initialize(): Promise<void> {
    try {
      await this.client.connect();
      await this.subscriber.connect();
      logger.info('Redis service initialized');
    } catch (error) {
      logger.error('Failed to initialize Redis service', { error });
      throw error;
    }
  }

  /**
   * Get main Redis client
   */
  getClient(): Redis {
    if (!this.isReady) {
      throw new Error('Redis client not ready');
    }
    return this.client;
  }

  /**
   * Get subscriber Redis client
   */
  getSubscriber(): Redis {
    return this.subscriber;
  }

  /**
   * Check if Redis is ready
   */
  ready(): boolean {
    return this.isReady;
  }

  /**
   * Set key with expiration
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Get key
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Delete key
   */
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * Set hash field
   */
  async hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  /**
   * Get hash field
   */
  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  /**
   * Get all hash fields
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  /**
   * Delete hash field
   */
  async hdel(key: string, field: string): Promise<number> {
    return this.client.hdel(key, field);
  }

  /**
   * Add to set
   */
  async sadd(key: string, member: string): Promise<number> {
    return this.client.sadd(key, member);
  }

  /**
   * Get set members
   */
  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  /**
   * Remove from set
   */
  async srem(key: string, member: string): Promise<number> {
    return this.client.srem(key, member);
  }

  /**
   * Publish message to channel
   */
  async publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message);
  }

  /**
   * Subscribe to channel
   */
  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        callback(msg);
      }
    });
  }

  /**
   * Unsubscribe from channel
   */
  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }

  /**
   * Increment counter
   */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /**
   * Decrement counter
   */
  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  /**
   * Set expiration on key
   */
  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  /**
   * Get keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  /**
   * Flush all data (use with caution!)
   */
  async flushall(): Promise<'OK'> {
    logger.warn('Flushing all Redis data');
    return this.client.flushall();
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    logger.info('Disconnecting from Redis');
    await this.client.quit();
    await this.subscriber.quit();
    this.isReady = false;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch (error) {
      logger.error('Redis health check failed', { error });
      return false;
    }
  }
}

// Singleton instance
export const redisService = new RedisService();
