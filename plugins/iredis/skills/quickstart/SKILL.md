---
name: iredis
description: Use this skill when the user wants to interact with a Redis database — run queries, get/set keys, check server info, or manage Redis from the terminal.
---

# iredis Plugin

iredis is an interactive Redis CLI with autocomplete, syntax highlighting, and a full-featured REPL. It supports both interactive and non-interactive command execution.

## Commands

### Self
- `iredis self version` — Print iredis version

### Query
- `iredis query run <command> [args...] [--raw] [--url <url>]` — Execute Redis commands
- `iredis query run --url redis://localhost:6379 GET mykey` — Example with URL
- `iredis query run -h host -p 6379 PING` — Example with host/port

### Passthrough
- `iredis _ _ <args>` — Raw passthrough (interactive mode, DSN mode, etc.)

## Usage Examples

- "ping the Redis server"
- "get key mykey from Redis"
- "list all keys with pattern user:*"
- "show Redis server info"
- "check Redis server version"

## Installation

```bash
pip install iredis
```

## Key Features
- Syntax highlighting and autocomplete for Redis commands
- Interactive REPL mode with command history
- Non-interactive command execution (pass commands as positional args)
- Raw output mode for machine parsing (--raw)
- Connection via host/port, URL, Unix socket, or DSN alias
- TLS/SSL connection support
- SSH tunnel and NAT map support for clusters
- Customizable prompt and color themes
- Pager support for large outputs

## Connections

```bash
# Default localhost:6379
iredis PING

# Specific host/port
iredis -h 10.0.0.1 -p 6380 -a mypassword GET mykey

# Redis URL
iredis --url redis://user:pass@host:6380/3 KEYS *

# DSN alias (configured in ~/.iredisrc)
iredis -d production KEYS *
```

## Requirements
- Redis server running and accessible
- Network connectivity to the Redis host
- Authentication credentials if required
