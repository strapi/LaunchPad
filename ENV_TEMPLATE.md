# Production Environment Variables Template

## IMPORTANT SECURITY NOTES:
- NEVER commit .env files to Git
- Use Coolify's environment variable UI for secrets
- Rotate secrets every 6 months
- Use strong passwords (min 32 characters for secrets)
- Keep backups of all secrets in secure vault

---

## Strapi Production (.env)

```env
# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-32-char-random-string-here
ADMIN_JWT_SECRET=your-32-char-random-string-here
JWT_SECRET=your-32-char-random-string-here
TRANSFER_TOKEN_SALT=your-32-char-random-string-here

# Database (PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres.internal  # Internal Docker network name
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your-super-secure-postgres-password
DATABASE_SSL=true

# Application URLs
STRAPI_URL=https://api.yourdomain.com
STRAPI_ADMIN_BACKEND_URL=https://api.yourdomain.com
STRAPI_ADMIN_FRONTEND_URL=https://api.yourdomain.com/admin

# CORS Configuration
STRAPI_CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
STRAPI_CORS_CREDENTIALS=true

# Memory
NODE_OPTIONS=--max-old-space-size=1024

# Logging
LOG_LEVEL=info

# Email Service (Resend)
SENDGRID_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@peter-sung.com
EMAIL_FROM_NAME=Peter Sung Platform

# File Upload
UPLOAD_PATH=./public/uploads

# SSL
ENABLE_SSL=true

# Cache
CACHE_PROVIDER=redis
REDIS_HOST=redis.internal
REDIS_PORT=6379
REDIS_DB=0
```

---

## Next.js Production (.env)

```env
# Application URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-32-char-random-string-here

# Node Environment
NODE_ENV=production

# NextAuth Configuration
NEXTAUTH_ADAPTER=prisma

# Third-party API Keys
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key
RESEND_API_KEY=your-resend-api-key

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Sentry Error Tracking (Optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-token

# Database
DATABASE_URL=postgresql://strapi_user:password@postgres.internal:5432/strapi_prod

# Strapi Admin
STRAPI_API_TOKEN=your-long-lived-strapi-api-token

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Image Optimization
NEXT_PUBLIC_IMAGE_SIZE_SMALL=640
NEXT_PUBLIC_IMAGE_SIZE_MEDIUM=1024
NEXT_PUBLIC_IMAGE_SIZE_LARGE=1920

# Feature Flags
FEATURE_AI_CHAT_ENABLED=true
FEATURE_ANALYTICS_ENABLED=true
FEATURE_ADVANCED_REPORTS=true
```

---

## Coolify Docker Compose Configuration

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: coolify-postgres
    restart: always
    environment:
      POSTGRES_DB: ${DATABASE_NAME}
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    networks:
      - coolify-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: coolify-redis
    restart: always
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    networks:
      - coolify-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Strapi CMS
  strapi:
    image: node:18-alpine
    container_name: coolify-strapi
    restart: always
    working_dir: /app
    command: npm run start
    environment:
      - HOST=0.0.0.0
      - PORT=1337
      - NODE_ENV=production
      - DATABASE_CLIENT=postgres
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_NAME=${DATABASE_NAME}
      - DATABASE_USERNAME=${DATABASE_USERNAME}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
      - DATABASE_SSL=false
      - NODE_OPTIONS=--max-old-space-size=1024
      - STRAPI_URL=${STRAPI_URL}
      - STRAPI_CORS_ORIGIN=${STRAPI_CORS_ORIGIN}
    volumes:
      - ./strapi:/app
      - strapi-cache:/app/.cache
      - strapi-uploads:/app/public/uploads
    ports:
      - "1337:1337"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - coolify-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1337/admin"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Next.js Frontend
  nextjs:
    image: node:18-alpine
    container_name: coolify-nextjs
    restart: always
    working_dir: /app
    command: npm run start
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}
      - RESEND_API_KEY=${RESEND_API_KEY}
    volumes:
      - ./next:/app
      - next-cache:/app/.next
      - next-build:/app/.next/static
    ports:
      - "3000:3000"
    depends_on:
      - strapi
    networks:
      - coolify-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: coolify-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - nextjs
      - strapi
    networks:
      - coolify-network

volumes:
  postgres-data:
  redis-data:
  strapi-cache:
  strapi-uploads:
  next-cache:
  next-build:

networks:
  coolify-network:
    driver: bridge
```

---

## Nginx Configuration Template

```nginx
# File: nginx/nginx.conf

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/js text/xml text/javascript 
               application/javascript application/x-javascript application/json;
    gzip_vary on;
    gzip_disable "msie6";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;

    # Upstream servers
    upstream nextjs_backend {
        server nextjs:3000;
    }

    upstream strapi_backend {
        server strapi:1337;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name _;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS - Frontend
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        location / {
            limit_req zone=general burst=20;
            proxy_pass http://nextjs_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # HTTPS - API
    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        add_header Strict-Transport-Security "max-age=31536000" always;
        add_header Access-Control-Allow-Origin "https://yourdomain.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

        location / {
            limit_req zone=api burst=100;
            proxy_pass http://strapi_backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

## Environment Setup Command

```bash
# Copy this to create .env from template
# Usage: bash setup-env.sh

#!/bin/bash

echo "Generating secure random strings..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)

# Create Strapi .env
cat > strapi/.env << EOF
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=$API_TOKEN_SALT
ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET
JWT_SECRET=$JWT_SECRET
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=CHANGE_ME_STRONG_PASSWORD
STRAPI_URL=https://api.yourdomain.com
STRAPI_CORS_ORIGIN=https://yourdomain.com
EOF

# Create Next.js .env
cat > next/.env.production << EOF
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
STRIPE_SECRET_KEY=sk_live_CHANGE_ME
STRIPE_PUBLISHABLE_KEY=pk_live_CHANGE_ME
GOOGLE_GENERATIVE_AI_API_KEY=CHANGE_ME
RESEND_API_KEY=CHANGE_ME
EOF

echo "✅ Environment files created!"
echo "⚠️  Please update all CHANGE_ME values with your actual secrets"
```

---

## Checklist Before Deployment

- [ ] All secrets generated and stored securely
- [ ] Database credentials changed from defaults
- [ ] SSL certificates ready
- [ ] API tokens created in Stripe
- [ ] Email service configured (Resend)
- [ ] AI API key added (Google Gemini)
- [ ] Domain DNS configured
- [ ] Database backups enabled
- [ ] Monitoring set up
- [ ] Runbook documented
- [ ] Team trained on operations
