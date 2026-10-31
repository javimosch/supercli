---
name: gunicorn
description: Python WSGI HTTP server for production deployment
---
# gunicorn Plugin

Gunicorn ('Green Unicorn') is a Python WSGI HTTP Server for UNIX. It's a pre-fork worker model server for running Python web applications in production.

## Commands
- `gunicorn <resource> <action>` — Execute gunicorn commands
- `gunicorn server run` — Start Gunicorn WSGI server with application module
- `gunicorn self version` — Show gunicorn version
- `gunicorn config check` — Check gunicorn configuration for validity
- `gunicorn _ _` — Passthrough to gunicorn CLI

## Common Commands

- `gunicorn myapp:app` — serve a WSGI app on default 127.0.0.1:8000
- `gunicorn myapp:app -w 4 -b 0.0.0.0:8000` — serve with 4 workers
- `gunicorn myapp:app --reload` — development with auto-reload
- `gunicorn --version` — show version
- `gunicorn -c config.py myapp:app` — use config file
