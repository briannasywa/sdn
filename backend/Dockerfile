# =========================================================================
# DEVSECOPS HARDENED DOCKERFILE FOR BACKEND (EXPRESS.JS + PRISMA)
# =========================================================================

# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma Client
RUN npm ci
RUN npx prisma generate

# Copy source code
COPY . .

# Stage 2: Production Hardened Runtime
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Security Hardening: Use non-root node user
USER node

# Copy dependencies and generated artifacts from builder
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/src ./src
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 5000

# Healthcheck to ensure container availability
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
