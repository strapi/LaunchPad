/**
 * Configuration Manager
 * Centralized configuration with validation
 */

import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load environment variables
dotenvConfig();

/**
 * Configuration Schema
 */
const ConfigSchema = z.object({
  // Server
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().min(1000).max(65535).default(4000),
  host: z.string().default('0.0.0.0'),

  // Redis
  redis: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(6379),
    password: z.string().optional(),
    db: z.coerce.number().default(0),
  }),

  // Docker
  docker: z.object({
    host: z.string().default('unix:///var/run/docker.sock'),
    network: z.string().default('peter-sung-agent-network'),
    agentImage: z.string().default('openhands/openhands-runtime:latest'),
  }),

  // OpenHands
  openhands: z.object({
    workspaceDir: z.string().default('/tmp/openhands-workspaces'),
    maxConcurrentAgents: z.coerce.number().default(10),
    agentTimeout: z.coerce.number().default(300000), // 5 minutes
  }),

  // LLM Providers
  llm: z.object({
    anthropic: z.object({
      apiKey: z.string().optional(),
      model: z.string().default('claude-sonnet-4-5-20250929'),
    }),
    google: z.object({
      apiKey: z.string().optional(),
      model: z.string().default('gemini-2.0-flash-exp'),
    }),
    openai: z.object({
      apiKey: z.string().optional(),
      model: z.string().default('gpt-4o'),
    }),
  }),

  // Strapi
  strapi: z.object({
    url: z.string().url().default('http://localhost:1337'),
    apiToken: z.string().optional(),
  }),

  // Authentication
  auth: z.object({
    jwtSecret: z.string().min(32),
    nextauthSecret: z.string().min(32),
    nextauthUrl: z.string().url().default('http://localhost:3000'),
  }),

  // Rate Limiting
  rateLimit: z.object({
    windowMs: z.coerce.number().default(900000), // 15 minutes
    maxRequests: z.coerce.number().default(100),
  }),

  // Monitoring
  monitoring: z.object({
    prometheusPort: z.coerce.number().default(9090),
    grafanaPort: z.coerce.number().default(3001),
  }),

  // Logging
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    file: z.string().default('./logs/agent-server.log'),
  }),

  // Feature Flags
  features: z.object({
    enableVoiceInput: z.coerce.boolean().default(false),
    enableImageUpload: z.coerce.boolean().default(false),
    enableFileAttachments: z.coerce.boolean().default(false),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Load and validate configuration
 */
function loadConfig(): Config {
  const rawConfig = {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    host: process.env.HOST,

    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB,
    },

    docker: {
      host: process.env.DOCKER_HOST,
      network: process.env.DOCKER_NETWORK,
      agentImage: process.env.AGENT_CONTAINER_IMAGE,
    },

    openhands: {
      workspaceDir: process.env.OPENHANDS_WORKSPACE_DIR,
      maxConcurrentAgents: process.env.OPENHANDS_MAX_CONCURRENT_AGENTS,
      agentTimeout: process.env.OPENHANDS_AGENT_TIMEOUT,
    },

    llm: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: process.env.ANTHROPIC_MODEL,
      },
      google: {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        model: process.env.GOOGLE_MODEL,
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL,
      },
    },

    strapi: {
      url: process.env.STRAPI_URL,
      apiToken: process.env.STRAPI_API_TOKEN,
    },

    auth: {
      jwtSecret: process.env.JWT_SECRET,
      nextauthSecret: process.env.NEXTAUTH_SECRET,
      nextauthUrl: process.env.NEXTAUTH_URL,
    },

    rateLimit: {
      windowMs: process.env.RATE_LIMIT_WINDOW_MS,
      maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
    },

    monitoring: {
      prometheusPort: process.env.PROMETHEUS_PORT,
      grafanaPort: process.env.GRAFANA_PORT,
    },

    logging: {
      level: process.env.LOG_LEVEL,
      file: process.env.LOG_FILE,
    },

    features: {
      enableVoiceInput: process.env.ENABLE_VOICE_INPUT,
      enableImageUpload: process.env.ENABLE_IMAGE_UPLOAD,
      enableFileAttachments: process.env.ENABLE_FILE_ATTACHMENTS,
    },
  };

  try {
    return ConfigSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Singleton configuration instance
 */
export const config = loadConfig();

/**
 * Check if running in development mode
 */
export const isDevelopment = config.nodeEnv === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = config.nodeEnv === 'production';

/**
 * Check if running in test mode
 */
export const isTest = config.nodeEnv === 'test';
