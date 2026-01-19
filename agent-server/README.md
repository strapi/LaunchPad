# Peter Sung Agent Server

OpenHands-powered AI Agent Orchestration Server for the Peter Sung coaching platform.

## Overview

This is the core agent orchestration layer that powers the Peter Sung platform's AI capabilities. Built on OpenHands SDK with Docker-based agent execution, WebSocket streaming, and enterprise-grade reliability.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│                  WebSocket Client + UI                       │
└────────────────────────┬────────────────────────────────────┘
                         │ WebSocket
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Agent Server (This)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  WebSocket   │  │    Queue     │  │   Docker     │      │
│  │    Server    │──│   Service    │──│   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                   │                  │             │
│         │                   │                  │             │
│  ┌──────▼──────────┬────────▼─────┬───────────▼──────────┐  │
│  │  Orchestrator   │   Redis      │   Docker Containers  │  │
│  │     Swarm       │   Queue      │   (OpenHands)        │  │
│  └─────────────────┴──────────────┴──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Strapi CMS (Data)                         │
└─────────────────────────────────────────────────────────────┘
```

## Features

- **OpenHands Integration**: Powered by OpenHands Software Agent SDK
- **Docker Orchestration**: Isolated container execution per agent session
- **Task Queue**: BullMQ-based reliable task processing
- **WebSocket Streaming**: Real-time bidirectional communication
- **Multi-Agent Swarm**: Hierarchical agent coordination
- **Resource Monitoring**: CPU and memory tracking per container
- **Rate Limiting**: Per-user quotas and throttling
- **Observability**: Prometheus metrics + Grafana dashboards

## Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Redis 7+
- LLM API Keys (Anthropic, Google, or OpenAI)

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your API keys
nano .env

# Start infrastructure (Redis, Prometheus, Grafana)
docker-compose up -d redis prometheus grafana

# Run in development mode
npm run dev

# Or build and run in production
npm run build
npm start
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f agent-server

# Stop services
docker-compose down
```

## Configuration

All configuration is managed via environment variables. See `.env.example` for full options.

### Required Variables

```env
# LLM Providers (at least one required)
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
OPENAI_API_KEY=sk-...

# Authentication
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-super-secret-nextauth-key

# Strapi Integration
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=...
```

## API Endpoints

### REST API

```
POST   /api/agents/task          - Create agent task
GET    /api/agents/task/:id      - Get task status
DELETE /api/agents/task/:id      - Cancel task
GET    /api/agents/sessions      - List user sessions
GET    /api/agents/metrics       - Performance metrics
GET    /health                   - Health check
```

### WebSocket Events

#### Client → Server

```typescript
// Create a new agent task
socket.emit('agent:task:create', {
  userId: 'uuid',
  taskType: 'coaching',
  prompt: 'Help me improve my leadership skills',
  context: {}
});

// Get task status
socket.emit('agent:task:status', { taskId: 'uuid' });

// Cancel task
socket.emit('agent:task:cancel', { taskId: 'uuid' });
```

#### Server → Client

```typescript
// Status update
socket.on('agent:status:update', (data) => {
  console.log(data.taskId, data.status, data.progress);
});

// Streaming content
socket.on('agent:stream:chunk', (data) => {
  console.log(data.content);
});

// Stream complete
socket.on('agent:stream:complete', (data) => {
  console.log('Task completed:', data.taskId);
});

// Container updates
socket.on('agent:container:update', (data) => {
  console.log('Container:', data.containerId, data.resources);
});
```

## Agent Types

1. **Orchestrator Agent** - Routes tasks to specialized agents
2. **Coaching Agent** - Leadership and coaching queries
3. **Content Agent** - Blog posts and resource management
4. **Client Management Agent** - CRUD for coaching clients
5. **Analytics Agent** - Data insights and visualization
6. **SecureBase Agent** - Trained on SecureBase content

## Development

### Project Structure

```
agent-server/
├── src/
│   ├── agents/          # Agent implementations
│   ├── orchestration/   # Swarm coordination
│   ├── api/             # REST API routes
│   ├── services/        # Core services
│   ├── utils/           # Utilities
│   └── types/           # TypeScript types
├── config/              # Configuration files
├── scripts/             # Helper scripts
├── logs/                # Log files
└── dist/                # Compiled JavaScript
```

### Running Tests

```bash
npm test
npm run test:watch
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## Monitoring

### Prometheus Metrics

Available at `http://localhost:9090`

Key metrics:
- `agent_tasks_total` - Total tasks processed
- `agent_task_duration_seconds` - Task duration histogram
- `agent_container_count` - Active containers
- `agent_queue_size` - Queue depth

### Grafana Dashboards

Available at `http://localhost:3001` (default login: admin/admin)

Pre-configured dashboards:
- Agent Performance Overview
- Container Resource Usage
- Queue Health Monitoring
- Error Rate Tracking

## Security

- **Sandbox Isolation**: All code execution in Docker containers
- **Rate Limiting**: Configurable per-user quotas
- **JWT Authentication**: Secure session management
- **Content Filtering**: Validation of agent outputs
- **Audit Logging**: All actions tracked

## Troubleshooting

### Docker socket permission denied

```bash
# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Redis connection errors

```bash
# Check Redis is running
docker-compose ps redis

# View Redis logs
docker-compose logs redis
```

### Container not starting

```bash
# Check Docker network
docker network ls | grep peter-sung

# Recreate network
docker network create peter-sung-agent-network
```

### High memory usage

Adjust container limits in config:

```env
OPENHANDS_MAX_CONCURRENT_AGENTS=5  # Reduce concurrent agents
```

## Performance Tuning

- **Concurrency**: Adjust `OPENHANDS_MAX_CONCURRENT_AGENTS`
- **Memory Limits**: Configure in Docker service (default 2GB per container)
- **Queue Workers**: Scale BullMQ workers for throughput
- **Redis**: Use persistent storage for production

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## License

Proprietary - Peter Sung Platform

## Support

For issues and questions:
- GitHub Issues: [executiveusa/peter-sung](https://github.com/executiveusa/peter-sung/issues)
- Documentation: See `/docs` directory
- Email: support@petersung.com

---

Built with ❤️ using [OpenHands](https://github.com/OpenHands/software-agent-sdk)
