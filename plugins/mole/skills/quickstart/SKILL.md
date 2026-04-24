---
name: mole
description: Use this skill when the user wants to create SSH tunnels, set up port forwarding, or manage persistent SSH connections with automatic reconnection.
---

# mole Plugin

CLI application to create SSH tunnels focused on resiliency and user experience. Automatically reconnect and manage multiple SSH tunnels.

## Commands

### Tunnel Management
- `mole tunnel start` — Start an SSH tunnel

### Utility
- `mole _ _` — Passthrough to mole CLI

## Usage Examples
- "Start SSH tunnel"
- "Port forwarding"
- "Create SSH tunnel"
- "Persistent SSH connection"

## Installation

```bash
brew install mole
```

Or via Go:
```bash
go install github.com/davrodpin/mole@latest
```

## Examples

```bash
# Local port forwarding
mole tunnel start local 8080:localhost:80 --server user@remote-server --key ~/.ssh/id_rsa

# Remote port forwarding
mole tunnel start remote 8080:localhost:80 --server user@remote-server

# With config file
mole tunnel start --alias my-tunnel

# Any mole command with passthrough
mole _ _ start local 8080:localhost:80 --server user@remote-server
mole _ _ show
```

## Key Features
- **Resilient** - Auto reconnection
- **Multiple** - Multiple tunnels
- **Config** - Config file support
- **Aliases** - Named tunnels
- **Local** - Local forwarding
- **Remote** - Remote forwarding
- **Dynamic** - Dynamic forwarding
- **Show** - Show active tunnels
- **Delete** - Delete tunnels
- **Logs** - Logging support

## Notes
- Requires SSH access to server
- Supports config file aliases
- Auto-reconnect on failure
- Great for development tunnels
