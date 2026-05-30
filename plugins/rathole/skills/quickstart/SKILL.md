---
name: rathole
description: Use this skill when the user wants to expose services behind NAT to the Internet, set up a reverse proxy tunnel, or use an alternative to ngrok/frp.
---

# rathole Plugin

A lightweight and high-performance reverse proxy for NAT traversal, written in Rust. Expose services behind NAT to the Internet via a server with a public IP.

## Commands

### Server Mode
- `rathole server start` — Start rathole in server mode with config file

### Client Mode
- `rathole client start` — Start rathole in client mode with config file

### Utility
- `rathole _ _` — Passthrough to rathole CLI

## Usage Examples
- "Expose my local SSH server to the internet"
- "Set up a reverse proxy tunnel through NAT"
- "Start rathole server with config"
- "Connect to rathole server from behind NAT"

## Installation

```bash
cargo install rathole
```

Or download pre-built binaries from [GitHub Releases](https://github.com/rathole-org/rathole/releases).

## Examples

```bash
# Start rathole in server mode
rathole server start server.toml

# Start rathole in client mode
rathole client start client.toml

# Explicitly specify mode
rathole server start --server server.toml
rathole client start --client client.toml

# Check version
rathole self version

# Passthrough for custom usage
rathole _ _ --help
rathole _ _ server.toml
```

## Server Configuration (server.toml)

```toml
[server]
bind_addr = "0.0.0.0:2333"

[server.services.my_service]
token = "your_secret_token"
bind_addr = "0.0.0.0:5202"
```

## Client Configuration (client.toml)

```toml
[client]
remote_addr = "your-server.com:2333"

[client.services.my_service]
token = "your_secret_token"
local_addr = "127.0.0.1:22"
```

## Key Features
- **High performance** — Much higher throughput than frp
- **Low resource consumption** — Minimal memory usage, binary as small as ~500KiB
- **Security** — Mandatory tokens, optional Noise Protocol encryption, TLS support
- **Hot reload** — Add/remove services without restart
- **TCP/UDP** — Supports both TCP and UDP forwarding
- **Cross-platform** — Linux, macOS, Windows, embedded devices

## Notes
- Requires a server with a public IP
- Configuration is split into server-side and client-side TOML files
- Service names must match between server and client configurations
- Supports Noise Protocol for easy encryption without certificates
- Docker image available at `rapiz1/rathole`
