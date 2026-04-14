---
name: mcpm
description: Use this skill when the user wants to install, search, or manage MCP servers, configure MCP profiles, or set up MCP Router for remote server sharing.
---

# mcpm Plugin

CLI MCP package manager & registry for all platforms.

## Commands

### Install
- `mcpm install <package>` — Install an MCP server package

### Search
- `mcpm search <query>` — Search the MCP registry

### Router
- `mcpm router start` — Start the MCP Router
- `mcpm router stop` — Stop the MCP Router

### Profile
- `mcpm profile list` — List all profiles
- `mcpm profile add <name>` — Add a new profile
- `mcpm profile remove <name>` — Remove a profile

## Usage Examples
- "Search for available MCP servers"
- "Install a specific MCP server"
- "Start MCP Router for remote sharing"
- "Manage MCP profiles"

## Installation

```bash
curl -sSL https://mcpm.sh/install | bash
```

## Examples

```bash
# Check version
mcpm --version

# Search for servers
mcpm search anthropic

# Install a package
mcpm install @modelcontextprotocol/server-anthropic

# Start router
mcpm router start --port 8080

# List profiles
mcpm profile list

# Add profile
mcpm profile add dev

# Remove profile
mcpm profile remove dev
```

## Key Features
- Cross-platform MCP package manager
- Search registry of MCP servers
- Router for remote server sharing
- Profile management for different configurations
- Works on Linux, macOS, and Windows (WSL)
