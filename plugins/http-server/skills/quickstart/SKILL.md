---
name: http-server
description: Use this skill when the user wants to serve static files via HTTP.
---

# HTTP-Server Plugin

Simple, zero-configuration command-line static HTTP server.

## Commands

### File Serving
- `http-server directory serve` — Serve a directory as static HTTP server

## Usage Examples
- "http-server directory serve --path ./public"
- "http-server directory serve --path ./public --port 3000"

## Installation

```bash
npm install --global http-server
```

## Examples

```bash
# Serve current directory
http-server

# Serve specific directory
http-server ./public

# Serve on custom port
http-server -p 3000

# Enable CORS
http-server --cors

# Enable gzip
http-server -g

# Silent mode
http-server -s

# Disable caching
http-server -c-1

# Custom headers
http-server -H "Access-Control-Allow-Origin:*"

# HTTPS with custom cert
http-server -S -C cert.pem -K key.pem
```

## Key Features
- Zero-configuration setup
- Automatic directory listing
- MIME type detection
- CORS support
- Gzip/Brotli compression
- Caching control
- Custom headers
- HTTPS support
- SPA support (404.html fallback)
