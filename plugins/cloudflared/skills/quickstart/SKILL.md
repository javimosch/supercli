---
name: cloudflared
description: Use this skill when the user wants to expose a local service to the internet via a reverse tunnel using Cloudflare Tunnel (cloudflared).
---

# Cloudflared Plugin

Expose localhost to the internet via Cloudflare Tunnel. Quick tunnels require no authentication.

## Commands

### Quick Tunnel (No Auth Required)
- `cloudflared tunnel --url http://localhost:PORT` — Expose a local port via a temporary Cloudflare URL

### Named Tunnels (Auth Required)
- `cloudflared tunnel login` — Authenticate with Cloudflare
- `cloudflared tunnel create <name>` — Create a named tunnel
- `cloudflared tunnel run <name>` — Run a named tunnel
- `cloudflared tunnel list` — List all tunnels
- `cloudflared tunnel delete <name>` — Delete a tunnel

## Usage Examples

### Quick Tunnel
```bash
# Expose a local web server on port 8080
supercli cloudflared tunnel quick --url http://localhost:8080

# Or directly
cloudflared tunnel --url http://localhost:8080
```

### Named Tunnels
```bash
# Login to Cloudflare
supercli cloudflared tunnel login

# Create a tunnel
supercli cloudflared tunnel create my-app

# Run the tunnel
supercli cloudflared tunnel run my-app
```

## Installation

```bash
curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared
```

## Key Features

- **No auth required for quick tunnels** — Just run and get a public URL
- **Free tier available** — Quick tunnels are completely free
- **Reliable** — Backed by Cloudflare's global network
- **HTTP/HTTPS support** — Automatic TLS termination
- **TCP/UDP support** — For non-HTTP services via named tunnels
