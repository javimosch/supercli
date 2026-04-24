---
name: dry
description: Use this skill when the user wants to monitor Docker containers, manage Docker resources from the terminal, or get an overview of Docker status.
---

# dry Plugin

A Docker manager for the terminal. Monitor and manage Docker containers, images, networks, and volumes from a terminal-based interface.

## Commands

### Docker Monitoring
- `dry docker monitor` — Monitor Docker containers and resources

### Utility
- `dry _ _` — Passthrough to dry CLI

## Usage Examples
- "Monitor Docker containers"
- "Docker resource overview"
- "Manage Docker from terminal"
- "Docker container status"

## Installation

```bash
brew install dry
```

Or via Go:
```bash
go install github.com/moncho/dry@latest
```

Requires Docker to be running.

## Examples

```bash
# Monitor local Docker
 dry docker monitor

# Monitor remote Docker
 dry docker monitor --host tcp://remote-docker:2375

# Any dry command with passthrough
 dry _ _
 dry _ _ --host tcp://docker:2376
```

## Key Features
- **Containers** - Container management
- **Images** - Image management
- **Networks** - Network management
- **Volumes** - Volume management
- **Logs** - Container logs
- **Stats** - Resource stats
- **Terminal** - Terminal UI
- **Multi-host** - Multi-host support
- **Monitoring** - Real-time monitoring
- **Navigation** - Keyboard navigation

## Notes
- Requires Docker daemon
- Terminal-based interface
- Great for Docker management
- Supports remote Docker hosts
