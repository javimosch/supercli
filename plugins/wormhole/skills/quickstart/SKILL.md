---
name: wormhole
description: Use this skill when the user wants to expose a local server or localhost application to the internet via a public URL tunnel.
---

# wormhole Plugin

Open-source ngrok alternative to expose local servers to the internet with one command. Built with Go and Cloudflare Workers.

## Commands

### Tunneling
- `wormhole tunnel start` — Expose a local HTTP server to the internet

### Utility
- `wormhole self version` — Print wormhole version
- `wormhole _ _` — Passthrough to wormhole CLI

## Usage Examples
- "Expose my local server on port 8080 to the internet"
- "Tunnel port 3000 with a custom subdomain"
- "Expose my dev server with traffic inspection enabled"

## Installation

```bash
go install github.com/MuhammadHananAsghar/wormhole@latest
```

## Examples

```bash
# Expose local server on port 8080
wormhole tunnel start 8080

# Expose with a custom subdomain
wormhole tunnel start 8080 --subdomain myapp

# Expose with traffic inspector
wormhole tunnel start 3000 --inspect

# Expose with custom subdomain and traffic inspection
wormhole tunnel start 5000 --subdomain myproject --inspect
```

## Key Features
- One-command public URL for local servers
- Custom subdomains (free)
- Traffic inspector for request/response details
- WebSocket support
- Built on Cloudflare Workers (fast, reliable)
- No account or API key required

## Notes
- Supports HTTP servers only (no HTTPS required locally)
- Custom subdomains are allocated on a first-come-first-served basis
- Traffic inspector shows detailed request/response information
- The tunnel stays active until the command is terminated
- For persistent tunnels, consider setting up a process manager
