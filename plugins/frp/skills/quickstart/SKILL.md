---
name: frp
description: Use this skill when the user wants to expose a local server behind NAT/firewall to the internet using frp reverse proxy tunnels (TCP, UDP, HTTP, HTTPS, STCP).
---

# frp Plugin

frp is a fast reverse proxy for exposing a local server behind a NAT or firewall to the internet. It supports TCP, UDP, HTTP, HTTPS, STCP, SUDP, and XTCP tunnel types.

## Commands

### Self
- `frp self version` — Print frpc version

### Client Operations
- `frp client run -c <config.toml>` — Run frpc client
- `frp client verify -c <config.toml>` — Validate config syntax
- `frp client reload -c <config.toml>` — Hot-reload config via admin API
- `frp client status -c <config.toml>` — Show proxy status via admin API
- `frp client stop -c <config.toml>` — Stop frpc via admin API
- `frp client nathole discover` — Discover NAT type via STUN

### Single Proxy (no config file)
- `frp proxy tcp --localPort 22 --remotePort 6000` — TCP tunnel
- `frp proxy udp --localPort 53 --remotePort 6001` — UDP tunnel
- `frp proxy http --localPort 8080 --customDomains example.com` — HTTP tunnel
- `frp proxy https --localPort 443 --customDomains example.com` — HTTPS tunnel

### Server Operations
- `frp server run -c <config.toml>` — Run frps server

### Passthrough
- `frp _ _ <args>` — Raw passthrough for any frpc command

## Usage Examples

- "start an frp client with config"
- "validate my frpc config file"
- "check frp proxy status"
- "hot-reload frpc configuration"
- "expose local port 22 via TCP on remote port 6000"
- "check version of frpc"
- "run frps server with config"

## Installation

```bash
brew install frp
# or download from GitHub releases
# https://github.com/fatedier/frp/releases/latest
```

## Key Features
- TCP, UDP, HTTP, HTTPS tunnel support
- STCP (secret TCP) for encrypted point-to-point tunnels
- XTCP for P2P connections (no server relay)
- TLS encryption for all control/data connections
- Admin UI with REST API (JSON)
- Hot-reload configuration without restart
- NAT type discovery via STUN
- Prometheus metrics on server dashboard
- Dynamic proxy management (v0.68+)

## Requirements
- frpc binary installed
- frps server running on a public-facing machine (for client mode)
- TOML config file for most production usage
- A running frps server instance to connect to

## Architecture

```
[Local Service] → [frpc] → [frps (public server)] → [Internet Users]
```
