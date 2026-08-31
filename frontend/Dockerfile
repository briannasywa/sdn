# =========================================================================
# MULTI-STAGE DOCKERFILE FOR FRONTEND (VITE REACT + NGINX ALPINE)
# =========================================================================

# Stage 1: Build static assets
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and build Vite bundle
COPY . .
RUN npm run build

# Stage 2: Serve using Lightweight Nginx Alpine
FROM nginx:1.27-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built dist files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck for frontend web server
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
