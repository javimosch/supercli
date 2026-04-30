---
name: http-nu
description: Use this skill when the user wants to spin up a lightweight HTTP server, serve static files, handle SSE, or prototype APIs with Nushell scripting.
---

# http-nu Plugin

Nushell-scriptable HTTP server with Datastar support, SSE, and reverse proxy.

## Commands

### Server
- `http-nu server start` — Start HTTP server with Nushell script handler

### Eval
- `http-nu eval run` — Evaluate a Nushell expression via http-nu

## Usage Examples
- "Start a quick HTTP server on port 3001"
- "Serve static files with Nushell handlers"
- "Create an SSE endpoint"

## Installation

```bash
cargo binstall http-nu
```

## Examples

```bash
# Start a simple server
http-nu :3001 -c '{|req| "Hello world"}'

# Serve from a file
http-nu :3001 ./serve.nu

# With watch mode (hot reload)
http-nu :3001 -w ./serve.nu

# Reverse proxy
http-nu :3001 --proxy http://localhost:8080
```

## Key Features
- Nushell-scriptable request handlers
- Datastar and SSE support
- Static file serving
- SQLite in-memory store
- TLS support
- Watch mode for development
- Reverse proxy capability
