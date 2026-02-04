# Multi-stage build for React production application
FROM node:20.0.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install with proper permissions
RUN npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install -g vite

# Copy source code
COPY . .

# Build the React app with Vite
RUN npm run build

# Production stage - serve with nginx for optimal performance
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
