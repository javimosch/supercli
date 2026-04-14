---
name: mockd
description: Use this skill when the user wants to mock APIs, create fake HTTP/gRPC servers, test with realistic API stubs, or set up mock services for development.
---

# mockd Plugin

One binary, seven protocols — mock HTTP, gRPC, GraphQL, WebSocket, MQTT, SSE, and SOAP.

## Commands

### Server
- `mockd server start` — Start mockd server

### Endpoints
- `mockd endpoint add` — Add a mock endpoint

### Import
- `mockd import` — Import OpenAPI/Postman/HAR specs

## Usage Examples
- "Start a mock HTTP server"
- "Create a stateful CRUD API"
- "Import an OpenAPI spec"

## Installation

```bash
curl -sSL https://get.mockd.io | sh
```

Or:
```bash
brew install getmockd/tap/mockd
docker run -p 4280:4280 ghcr.io/getmockd/mockd:latest
```

## Examples

```bash
# Start server
mockd start

# Add HTTP endpoint
mockd add http --path /api/users --stateful users

# Test
curl -X POST localhost:4280/api/users -d '{"name":"Alice"}'

# Import OpenAPI
mockd import openapi.yaml

# Digital twin
mockd start -c stripe-twin.yaml

# Chaos engineering
mockd chaos apply flaky
```

## Key Features
- 7 protocols: HTTP, gRPC, GraphQL, WS, MQTT, SSE, SOAP
- Stateful CRUD
- OpenAPI/Postman/HAR import
- Chaos engineering
- MCP server for AI agents
- Cloud tunnel sharing
