---
name: sonar
description: Use this skill when the user wants to inspect, manage, or monitor services listening on localhost ports.
---

# sonar Plugin

CLI tool for inspecting and managing services listening on localhost ports. sonar lists processes, shows port details, kills services, waits for ports to be ready, and visualizes service dependencies.

## Commands

### Port Management
- `sonar ports list` — List services listening on localhost ports
- `sonar port info` — Show detailed information about a specific port
- `sonar port kill` — Kill the process listening on a port
- `sonar ports wait` — Wait for ports to accept connections
- `sonar ports graph` — Show dependency graph between services
- `sonar port logs` — View logs for a service on a port
- `sonar profile list` — List saved port profiles
- `sonar self version` — Print sonar version
- `sonar _ _` — Passthrough to sonar CLI

## Usage Examples
- "List all ports with JSON output"
- "Show what's running on port 3000"
- "Kill the service on port 8080"
- "Wait for port 5432 to be ready"
- "Show service dependency graph"

## Installation

```bash
curl -sfL https://raw.githubusercontent.com/raskrebs/sonar/main/scripts/install.sh | bash
```

## Examples

```bash
# List all listening ports
sonar ports list

# List with resource stats and JSON output
sonar ports list --stats --json

# Filter only Docker containers
sonar ports list --filter docker

# Show detailed info for port 3000
sonar port info 3000

# Kill the process on port 3000
sonar port kill 3000

# Force kill
sonar port kill 3000 -f

# Wait for PostgreSQL and app server to be ready
sonar ports wait 5432 3000 --timeout 60s

# Wait for HTTP 200 on health endpoint
sonar ports wait 3000 --http=/health --timeout 30s

# Show service dependency graph
sonar ports graph --json

# View logs for a Docker container on port 3000
sonar port logs 3000
```

## Key Features
- List ports with CPU, memory, uptime, and health status
- Filter by Docker, user processes, or system services
- JSON output for scripting and CI integration
- Wait for ports with TCP or HTTP readiness checks
- Dependency graph visualization
- Profile-based port management for projects
- Docker and docker-compose awareness
