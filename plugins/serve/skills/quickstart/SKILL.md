---
name: serve
description: Use this skill when the user wants to serve static files via HTTP.
---

# Serve Plugin

Static file serving and directory listing. Production-ready static file server.

## Commands

### File Serving
- `serve directory serve` — Serve a directory as static HTTP server

## Usage Examples
- "serve directory serve --path ./public"
- "serve directory serve --path ./public --port 8080"

## Installation

```bash
npm install -g serve
```

## Examples

```bash
# Serve current directory
serve

# Serve specific directory
serve ./public

# Serve on custom port
serve -p 8080

# SPA mode (rewrites all requests to index.html)
serve -s

# Disable caching
serve -n

# Open browser automatically
serve -o

# Custom listen address
serve -l tcp://0.0.0.0:3000

# Set custom headers
serve -h '{"Access-Control-Allow-Origin": "*"}'

# Enable CORS
serve -c
```

## Key Features
- Production-ready static file server
- SPA support with --single flag
- Directory listing
- CORS support
- Custom headers
- Automatic browser opening
- Caching control
- Zero-configuration
