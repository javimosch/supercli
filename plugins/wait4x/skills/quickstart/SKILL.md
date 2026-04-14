---
name: wait4x
description: Use this skill when the user wants to wait for a service to be ready, check if a port is open, verify a database connection, or wait for HTTP endpoints in CI/CD pipelines or container orchestration.
---

# Wait4X Plugin

Wait for services to be ready before proceeding. Zero-dependency, multi-protocol.

## Commands

### TCP
- `wait4x tcp wait` — Wait for TCP port to be available

### HTTP
- `wait4x http wait` — Wait for HTTP endpoint with status/body checks

### Databases
- `wait4x mysql wait` — Wait for MySQL database
- `wait4x postgresql wait` — Wait for PostgreSQL database
- `wait4x mongodb wait` — Wait for MongoDB database
- `wait4x redis wait` — Wait for Redis server

### Message Queue
- `wait4x kafka wait` — Wait for Kafka broker

### DNS
- `wait4x dns wait` — Wait for DNS record

## Usage Examples
- "Wait for localhost:3306 to be ready"
- "Wait for HTTP endpoint with status 200"
- "Wait for MySQL database at localhost:3306"
- "Wait for Redis key to exist"
- "Check if port 8080 is free"

## Supported Services
- TCP ports
- HTTP/S endpoints
- MySQL, PostgreSQL, MongoDB
- Redis
- Kafka, RabbitMQ
- DNS (A, AAAA, CNAME, MX, NS, TXT)
- InfluxDB, Temporal

## Common Options
- `--timeout` — Max wait time (e.g., 30s, 2m)
- `--interval` — Check interval (default: 1s)
- `--invert-check` — Wait for NOT ready (port free)
- `--backoff-policy exponential` — Smart retries