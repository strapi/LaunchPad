/**
 * Core types for the OpenHands Agent Server
 */

import { z } from 'zod';

/**
 * Agent Task Types
 */
export enum AgentTaskType {
  COACHING = 'coaching',
  CONTENT = 'content',
  CLIENT_MANAGEMENT = 'client',
  ANALYTICS = 'analytics',
  SECUREBASE = 'securebase',
  GENERAL = 'general',
}

/**
 * Agent Task Status
 */
export enum AgentTaskStatus {
  QUEUED = 'queued',
  INITIALIZING = 'initializing',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Agent Type
 */
export enum AgentType {
  ORCHESTRATOR = 'orchestrator',
  COACHING = 'coaching',
  CONTENT = 'content',
  CLIENT_MANAGEMENT = 'client_management',
  ANALYTICS = 'analytics',
  SECUREBASE = 'securebase',
}

/**
 * Coordination Pattern
 */
export enum CoordinationPattern {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  HIERARCHICAL = 'hierarchical',
  GRAPH = 'graph',
}

/**
 * Zod Schemas for Validation
 */
export const AgentTaskRequestSchema = z.object({
  userId: z.string().uuid(),
  taskType: z.nativeEnum(AgentTaskType),
  prompt: z.string().min(1).max(10000),
  context: z.record(z.any()).optional(),
  priority: z.number().min(0).max(10).default(5),
  maxTokens: z.number().min(100).max(100000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  model: z.string().optional(),
});

export const AgentTaskResponseSchema = z.object({
  taskId: z.string().uuid(),
  status: z.nativeEnum(AgentTaskStatus),
  createdAt: z.date(),
  estimatedCompletionTime: z.number().optional(),
});

export const AgentStatusUpdateSchema = z.object({
  taskId: z.string().uuid(),
  status: z.nativeEnum(AgentTaskStatus),
  containerId: z.string().optional(),
  progress: z.number().min(0).max(100),
  message: z.string(),
  timestamp: z.number(),
  metadata: z.record(z.any()).optional(),
});

export const AgentStreamChunkSchema = z.object({
  taskId: z.string().uuid(),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
  isComplete: z.boolean().default(false),
});

/**
 * TypeScript Types (inferred from Zod schemas)
 */
export type AgentTaskRequest = z.infer<typeof AgentTaskRequestSchema>;
export type AgentTaskResponse = z.infer<typeof AgentTaskResponseSchema>;
export type AgentStatusUpdate = z.infer<typeof AgentStatusUpdateSchema>;
export type AgentStreamChunk = z.infer<typeof AgentStreamChunkSchema>;

/**
 * Agent Configuration
 */
export interface AgentConfig {
  type: AgentType;
  model: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  systemPrompt: string;
  capabilities: string[];
}

/**
 * Agent Context
 */
export interface AgentContext {
  userId: string;
  sessionId: string;
  conversationHistory: ConversationMessage[];
  strapiData?: Record<string, any>;
  securebaseKnowledge?: string[];
  userProfile?: UserProfile;
}

/**
 * Conversation Message
 */
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * User Profile
 */
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'client' | 'coach' | 'admin';
  preferences?: Record<string, any>;
  subscription?: {
    plan: string;
    active: boolean;
    expiresAt?: Date;
  };
}

/**
 * Docker Container Info
 */
export interface ContainerInfo {
  id: string;
  taskId: string;
  status: 'creating' | 'running' | 'stopped' | 'error';
  createdAt: Date;
  resources: {
    cpuUsage?: number;
    memoryUsage?: number;
  };
}

/**
 * Agent Metrics
 */
export interface AgentMetrics {
  taskId: string;
  agentType: AgentType;
  duration: number;
  tokensUsed: number;
  cost: number;
  success: boolean;
  errorType?: string;
  timestamp: Date;
}

/**
 * Task Queue Job
 */
export interface TaskQueueJob {
  taskId: string;
  request: AgentTaskRequest;
  retryCount: number;
  maxRetries: number;
}

/**
 * WebSocket Events
 */
export enum WebSocketEvent {
  // Client to Server
  TASK_CREATE = 'agent:task:create',
  TASK_CANCEL = 'agent:task:cancel',
  TASK_GET_STATUS = 'agent:task:status',

  // Server to Client
  STATUS_UPDATE = 'agent:status:update',
  STREAM_CHUNK = 'agent:stream:chunk',
  STREAM_COMPLETE = 'agent:stream:complete',
  ERROR = 'agent:error',
  CONTAINER_UPDATE = 'agent:container:update',
}

/**
 * Error Types
 */
export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class ValidationError extends AgentError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, metadata);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends AgentError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends AgentError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_FAILED', 401);
    this.name = 'AuthenticationError';
  }
}

export class ContainerError extends AgentError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'CONTAINER_ERROR', 500, metadata);
    this.name = 'ContainerError';
  }
}
