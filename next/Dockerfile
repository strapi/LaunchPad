# Multi-stage Dockerfile for Next.js (Node 22)
FROM node:22-bullseye-slim AS builder
WORKDIR /app

# Install build dependencies
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		build-essential python3 ca-certificates git curl libvips-dev \
	&& rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Enable Corepack and install ALL dependencies
RUN corepack enable \
	&& corepack prepare yarn@stable --activate \
	&& yarn install --immutable

# Copy source and build
COPY . .
RUN yarn build

# Production stage
FROM node:22-bullseye-slim AS runner
WORKDIR /app

# Runtime dependencies
RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates libvips42 \
	&& rm -rf /var/lib/apt/lists/*

# Enable Corepack
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install production dependencies (nouvelle syntaxe Yarn v2+)
RUN yarn workspaces focus --production

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "start"]