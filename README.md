# OpenTelemetry Span Tester

A test application for OpenTelemetry tracing functionality. Generates spans at different log levels and visualizes them in Jaeger.

## Overview

This project was created to test OpenTelemetry implementations and verify distributed tracing behavior. Built with the Elysia framework and implemented in TypeScript on the Bun runtime.

## Key Features

- **Multiple log level support**: Generate spans at debug, info, warn, and error levels
- **Automatic error handling**: Automatically records span status and exceptions for error level
- **Jaeger integration**: Sends traces to Jaeger via OTLP gRPC protocol
- **Docker support**: Containerized application and Jaeger configuration
- **Automated testing**: Integration test suite via Taskfile

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript (strict mode)
- **Framework**: Elysia
- **Tracing**: OpenTelemetry with OTLP gRPC
- **Backend**: Jaeger
- **Container**: Docker/Docker Compose
- **Task Runner**: Taskfile

## Installation

```bash
# Install dependencies
bun install
```

## Usage

### Development Mode

```bash
# Start development server with file watching
bun run dev
```

### Production (Docker)

```bash
# Start application and Jaeger
task up

# Stop and cleanup
task down
```

### Running Tests

```bash
# Run complete test suite
task test

# Individual test commands
task send-spans     # Send test spans
task verify-spans   # Verify spans in Jaeger
```

## API Endpoints

### Health Check
- `GET /` - Application health check

### Span Generation
- `ALL /:level?body=<message>` - Generate span at specified level
  - **level**: One of `debug`, `info`, `warn`, `error`
  - **body**: Message sent as query parameter

#### Usage Examples

```bash
# Debug level span
curl "http://localhost:3000/debug?body=Debug%20message"

# Info level span
curl "http://localhost:3000/info?body=System%20information"

# Warn level span
curl "http://localhost:3000/warn?body=Warning%20detected"

# Error level span (records Exception and ERROR status)
curl "http://localhost:3000/error?body=Critical%20error"
```

## Monitoring

### Jaeger UI
Access Jaeger UI at http://localhost:16686
- Service name: `span-tester`
- Search, analyze, and visualize traces

## Code Quality

```bash
# Format and lint check
bunx @biomejs/biome check .

# Code formatting
bunx @biomejs/biome format --write .

# Run linting
bunx @biomejs/biome lint .

# Type checking
bunx tsc --noEmit
```

## Project Structure

```
span-tester/
├── src/
│   └── index.ts          # Main application
├── compose.yml           # Docker Compose configuration
├── Dockerfile           # Application container definition
├── Taskfile.yml         # Task automation configuration
├── biome.json           # Code formatting/linting configuration
├── package.json         # Project configuration and dependencies
├── CLAUDE.md            # Claude Code guidance
└── README.md            # This file
```

## How It Works

1. **Span generation**: Retrieves active OpenTelemetry span when receiving HTTP request
2. **Event recording**: Adds events and metadata to span based on log level
3. **Error handling**: Records Exception and ERROR status for error level
4. **Trace transmission**: BatchSpanProcessor sends traces to Jaeger via OTLP
5. **Visualization**: Search and analyze traces in Jaeger UI

## Configuration

### Environment Variables (configured in compose.yml)

- `OTEL_SERVICE_NAME`: Service name (span-tester)
- `OTEL_EXPORTER_OTLP_ENDPOINT`: Jaeger OTLP endpoint
- `OTEL_EXPORTER_OTLP_PROTOCOL`: Protocol (grpc)
- `OTEL_TRACES_EXPORTER`: Exporter type (otlp)

### Port Configuration

- **3000**: Application port
- **16686**: Jaeger UI port
- **4317**: OTLP gRPC port (internal communication)

## Troubleshooting

### If traces are not visible

1. Verify Jaeger is running properly
   ```bash
   docker compose ps
   ```

2. Check application logs
   ```bash
   docker compose logs app
   ```

3. Manually send test spans
   ```bash
   task send-spans
   ```

4. Check service name in Jaeger UI
   - Verify service list at http://localhost:16686

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## References

- [OpenTelemetry Official Documentation](https://opentelemetry.io/docs/)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/)
- [Elysia Framework](https://elysiajs.com/)
- [Bun Runtime](https://bun.sh/)