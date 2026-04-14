---
name: wstunnel
description: Use this skill when the user wants to tunnel traffic through firewalls, set up a SOCKS5 proxy, bypass DPI, or securely tunnel traffic over WebSocket.
---

# wstunnel Plugin

Tunnel all your traffic over WebSocket or HTTP2 — bypass firewalls and proxies.

## Commands

### Server
- `wstunnel server start` — Start wstunnel server

### Client
- `wstunnel client start` — Start wstunnel client

## Usage Examples
- "Start a wstunnel server"
- "Connect as a client to tunnel traffic"
- "Set up a SOCKS5 proxy"
- "Tunnel SSH traffic"

## Installation

Download from https://github.com/erebe/wstunnel/releases

## Examples

```bash
# Start server
wstunnel server wss://0.0.0.0:8080

# Client with SOCKS5 proxy
wstunnel client -L socks5://127.0.0.1:8888 wss://my.server.com:8080

# Local port forwarding
wstunnel client -L tcp://9999:127.0.0.1:22 wss://my.server.com:443

# With HTTP proxy
wstunnel client -L tcp://9999:127.0.0.1:22 -p http://proxy:8080 wss://my.server.com:443
```

## Key Features
- Bypass firewalls and DPI
- WebSocket and HTTP2 transport
- TCP, UDP, SOCKS5, Unix socket support
- Transparent proxy (Linux)
- mTLS support
- WireGuard tunneling