---
name: uvicorn
description: uvicorn — lightning-fast ASGI server for Python async web frameworks like FastAPI
---

# uvicorn Plugin

uvicorn — lightning-fast ASGI server for Python async web frameworks like FastAPI

## Installation

```bash
pip install uvicorn
Verify: uvicorn --version
```

## Commands

### `sc uvicorn server start <app> [--host <value>] [--port <value>] [--reload] [--reload-dir <value>] [--workers <value>] [--uds <value>] [--log-level <value>] [--proxy-headers] [--forwarded-allow-ips <value>] [--timeout-keep-alive <value>]`

Start an ASGI server for a Python app

- `app` (string, required) — ASGI app in module:app format (e.g. main:app)
- `--host` (string, optional) — Bind socket to this host (default: 127.0.0.1)
- `--port` (integer, optional) — Bind socket to this port (default: 8000)
- `--reload` (boolean, optional) — Enable auto-reload on file changes
- `--reload-dir` (string, optional) — Set reload directories explicitly
- `--workers` (integer, optional) — Number of worker processes
- `--uds` (string, optional) — Bind to a UNIX domain socket
- `--log-level` (string, optional) — Log level (debug, info, warning, error, critical)
- `--proxy-headers` (boolean, optional) — Enable X-Forwarded-For proxy headers
- `--forwarded-allow-ips` (string, optional) — Comma-separated IPs to trust for forwarded headers
- `--timeout-keep-alive` (integer, optional) — Keep-Alive timeout (default: 5)

## Passthrough

```bash
sc uvicorn _ _ <args...>
```

## SuperCLI

```bash
sc uvicorn _ _ --help
sc plugins learn uvicorn
```
