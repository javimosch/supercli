---
name: live-server
description: Use this skill when the user wants a quick development HTTP server with automatic browser reload on file changes.
---

# live-server Plugin

live-server serves static files with automatic browser reload on file changes. Ideal for frontend development and rapid prototyping.

## Commands

- `live-server _ _ <args>` — Passthrough

## Usage Examples

- "serve current directory with live reload"
- "start server on port 8080 with HTTPS"
- "serve with SPA history fallback"
- "open browser on server start"

## Installation

```bash
npm install -g live-server
```

## Key Features
- Automatic browser reload on file changes
- Configurable port and host binding
- HTTPS support with custom certificate
- SPA history fallback for client-side routing
- Custom middleware support
- File ignore patterns for watch exclusion
- Browser auto-open on startup
