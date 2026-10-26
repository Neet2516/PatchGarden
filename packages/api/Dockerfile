# Multi-stage Dockerfile for PatchGarden Backend API
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./
COPY tsconfig.base.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/core/tsconfig.json ./packages/core/
COPY packages/api/package*.json ./packages/api/
COPY packages/api/tsconfig.json ./packages/api/

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/core ./packages/core
COPY packages/api ./packages/api

# Build core and API packages
RUN npm run build -w packages/core
RUN npm run build -w packages/api

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy package manifests and production dependencies
COPY package*.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/api/package*.json ./packages/api/

RUN npm ci --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/api/dist ./packages/api/dist

# Expose API port
EXPOSE 3001

# Run API server
CMD ["node", "packages/api/dist/index.js"]
