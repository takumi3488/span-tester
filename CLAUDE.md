# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
This is an OpenTelemetry tracing test application built with Bun and Elysia framework. It generates spans at different log levels and sends them to Jaeger for visualization.

## Common Development Commands

### Running the Application
- `bun run dev` - Start in development mode with file watching
- `task up` - Start application and Jaeger using Docker Compose
- `task down` - Stop and remove Docker containers

### Testing
- `task test` - Run complete test suite (starts containers, sends test spans, verifies in Jaeger, stops containers)
- `task send-spans` - Send test spans to the application
- `task verify-spans` - Verify spans were received by Jaeger

### Code Quality
- `bunx @biomejs/biome check .` - Run format and lint checks
- `bunx @biomejs/biome format --write .` - Format code
- `bunx @biomejs/biome lint .` - Run linting
- `bunx tsc --noEmit` - Type check TypeScript code

### Monitoring
- Jaeger UI: `http://localhost:16686` (service name: `span-tester`)
- Application: `http://localhost:3000`

## Architecture

### Tech Stack
- **Runtime**: Bun
- **Language**: TypeScript (strict mode)
- **Framework**: Elysia
- **Tracing**: OpenTelemetry with OTLP gRPC exporter
- **Backend**: Jaeger
- **Containerization**: Docker/Docker Compose
- **Task Runner**: Taskfile

### Project Structure
- `src/index.ts` - Main application with HTTP endpoints and OpenTelemetry setup
- `compose.yml` - Docker Compose configuration for app and Jaeger
- `Taskfile.yml` - Task automation for testing and deployment
- `biome.json` - Code formatting and linting configuration

### Key Endpoints
- `GET /` - Health check endpoint
- `ALL /:level` - Generate spans at specified log level (debug, info, warn, error)

## Code Style
- **Formatting**: Tabs for indentation, double quotes for strings
- **Linting**: Biome recommended rules with strict TypeScript
- **Imports**: Auto-organized by Biome

## Testing Workflow
1. Start services: `task up`
2. Send test spans: `task send-spans`
3. Verify in Jaeger: `task verify-spans` or visit http://localhost:16686
4. Clean up: `task down`

## Important Notes
- The application uses gRPC protocol to send traces to Jaeger on port 4317
- Environment variables are configured in `compose.yml`
- Health checks are configured for both application and Jaeger services
- The application waits for Jaeger to be healthy before starting