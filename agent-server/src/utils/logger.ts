/**
 * Logger Utility
 * Winston-based structured logging
 */

import winston from 'winston';
import { config } from './config.js';
import path from 'path';
import fs from 'fs';

// Ensure log directory exists
const logDir = path.dirname(config.logging.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Custom format for console output
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

/**
 * Custom format for file output
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create logger instance
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: fileFormat,
  defaultMeta: { service: 'agent-server' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: config.logging.file,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // Separate file for errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5,
    }),
  ],
});

/**
 * Stream for Morgan HTTP logger
 */
export const httpLoggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

/**
 * Create child logger with additional context
 */
export function createContextLogger(context: Record<string, any>) {
  return logger.child(context);
}

/**
 * Log agent task lifecycle events
 */
export const agentLogger = {
  taskCreated: (taskId: string, userId: string, taskType: string) => {
    logger.info('Agent task created', { taskId, userId, taskType });
  },

  taskQueued: (taskId: string, queuePosition?: number) => {
    logger.info('Agent task queued', { taskId, queuePosition });
  },

  taskStarted: (taskId: string, containerId: string) => {
    logger.info('Agent task started', { taskId, containerId });
  },

  taskProgress: (taskId: string, progress: number, message: string) => {
    logger.debug('Agent task progress', { taskId, progress, message });
  },

  taskCompleted: (taskId: string, duration: number, tokensUsed?: number) => {
    logger.info('Agent task completed', { taskId, duration, tokensUsed });
  },

  taskFailed: (taskId: string, error: Error) => {
    logger.error('Agent task failed', {
      taskId,
      error: error.message,
      stack: error.stack,
    });
  },

  taskCancelled: (taskId: string, reason?: string) => {
    logger.info('Agent task cancelled', { taskId, reason });
  },
};

/**
 * Log container lifecycle events
 */
export const containerLogger = {
  creating: (taskId: string, containerId: string) => {
    logger.info('Container creating', { taskId, containerId });
  },

  started: (taskId: string, containerId: string) => {
    logger.info('Container started', { taskId, containerId });
  },

  stopped: (taskId: string, containerId: string) => {
    logger.info('Container stopped', { taskId, containerId });
  },

  error: (taskId: string, containerId: string, error: Error) => {
    logger.error('Container error', {
      taskId,
      containerId,
      error: error.message,
    });
  },
};

/**
 * Log WebSocket events
 */
export const wsLogger = {
  connected: (socketId: string, userId?: string) => {
    logger.info('WebSocket connected', { socketId, userId });
  },

  disconnected: (socketId: string, reason?: string) => {
    logger.info('WebSocket disconnected', { socketId, reason });
  },

  error: (socketId: string, error: Error) => {
    logger.error('WebSocket error', {
      socketId,
      error: error.message,
    });
  },
};

/**
 * Log API requests
 */
export const apiLogger = {
  request: (
    method: string,
    path: string,
    userId?: string,
    ip?: string
  ) => {
    logger.debug('API request', { method, path, userId, ip });
  },

  response: (
    method: string,
    path: string,
    statusCode: number,
    duration: number
  ) => {
    logger.debug('API response', { method, path, statusCode, duration });
  },

  error: (
    method: string,
    path: string,
    statusCode: number,
    error: Error
  ) => {
    logger.error('API error', {
      method,
      path,
      statusCode,
      error: error.message,
      stack: error.stack,
    });
  },
};

export default logger;
