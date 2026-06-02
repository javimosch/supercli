---
name: mitmproxy
description: Use this skill when the user wants to debug HTTP traffic, inspect HTTPS requests, capture network traffic, or use mitmproxy for security testing.
---

# mitmproxy Plugin

Interactive HTTPS proxy for debugging and inspecting HTTP/HTTPS traffic. Available as mitmproxy (console), mitmdump (CLI), and mitmweb (web UI).

## Commands

### Proxy
- `mitmproxy proxy start` — Start interactive console proxy
- `mitmproxy dump capture` — Capture traffic to file via mitmdump
- `mitmproxy web start` — Start web-based proxy interface

## Usage Examples
- "Start mitmproxy to debug HTTP traffic"
- "Capture network requests to a file"
- "Inspect HTTPS traffic with mitmweb"

## Installation

```bash
pip install mitmproxy
# or
brew install mitmproxy
```

## Examples

```bash
# Start interactive proxy
mitmproxy

# Start on specific port
mitmproxy --listen-port 9090

# Capture with filter
mitmdump --listen-port 8080 -w capture.flow

# Filter traffic
mitmdump --listen-port 8080 '~u google.com'

# Web interface
mitmweb --listen-port 8080 --web-port 8081

# Transparent proxy mode
mitmproxy --mode transparent

# Socks5 mode
mitmproxy --mode socks5

# Reverse proxy
mitmproxy --mode reverse:https://example.com
```

## Key Features
- Intercept and inspect HTTP/HTTPS traffic
- Modify requests/responses on the fly
- Replay captured traffic
- Scriptable with Python
- Client-side SSL/TLS certificate generation
- Supports HTTP/1, HTTP/2, and WebSockets
