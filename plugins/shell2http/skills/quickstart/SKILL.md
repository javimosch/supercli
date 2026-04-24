---
name: shell2http
description: Use this skill when the user wants to expose shell commands as HTTP endpoints, create quick APIs from scripts, or integrate shell commands with HTTP services.
---

# shell2http Plugin

Executing shell commands via HTTP server. Expose any shell command as an HTTP endpoint for easy integration and automation.

## Commands

### Server Management
- `shell2http server start` — Start HTTP server for shell commands

### Utility
- `shell2http _ _` — Passthrough to shell2http CLI

## Usage Examples
- "Start HTTP server for commands"
- "Expose shell script via HTTP"
- "Create API from shell commands"
- "HTTP endpoint for script"

## Installation

```bash
brew install shell2http
```

Or via Go:
```bash
go install github.com/msoap/shell2http@latest
```

## Examples

```bash
# Basic server
shell2http server start /date date /uptime "uptime"

# With custom port
shell2http server start --port 8080 /hello "echo Hello, World!"

# With timeout
shell2http server start --timeout 30 /script "./my-script.sh"

# Without index page
shell2http server start --no-index /api "curl https://api.example.com"

# Any shell2http command with passthrough
shell2http _ _ /echo echo
shell2http _ _ --port 8888 /status "systemctl status"
```

## Key Features
- **HTTP** - HTTP endpoints
- **Shell** - Shell commands
- **Simple** - Simple syntax
- **Fast** - Quick setup
- **Port** - Configurable port
- **Host** - Configurable host
- **Timeout** - Command timeout
- **Index** - Auto-generated index
- **Integration** - Easy integration
- **Automation** - Automation friendly

## Notes
- Map URLs to shell commands
- Great for quick APIs
- Supports GET and POST
- Perfect for webhooks
