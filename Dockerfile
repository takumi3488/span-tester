# Build stage
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY src ./src
COPY biome.json ./

# Runtime stage
FROM oven/bun:1-alpine
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy application from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

# Create non-root user
RUN addgroup -g 1001 -S bunuser && \
    adduser -u 1001 -S bunuser -G bunuser

USER bunuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]
