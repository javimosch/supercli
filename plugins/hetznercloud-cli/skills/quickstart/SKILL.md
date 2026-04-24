---
name: hetznercloud-cli
description: Use this skill when the user wants to manage Hetzner Cloud resources, create servers, manage networks, or interact with Hetzner Cloud from the command line.
---

# hetznercloud-cli Plugin

Official Hetzner Cloud command line interface. Manage servers, networks, volumes, and all Hetzner Cloud resources from the terminal.

## Commands

### Server Management
- `hetznercloud-cli server list` — List Hetzner Cloud servers
- `hetznercloud-cli server create` — Create a new server

### Utility
- `hetznercloud-cli _ _` — Passthrough to hcloud CLI

## Usage Examples
- "List Hetzner servers"
- "Create a server"
- "Manage Hetzner Cloud"
- "List cloud resources"

## Installation

```bash
brew install hcloud
```

Requires Hetzner Cloud API token configured.

## Examples

```bash
# List servers
hetznercloud-cli server list

# Create a server
hetznercloud-cli server create my-server --type cx11 --image ubuntu-22.04 --location nbg1

# List with JSON output
hetznercloud-cli server list --output json

# Filter by label
hetznercloud-cli server list --selector env=production

# Any hcloud command with passthrough
hetznercloud-cli _ _ server list
hetznercloud-cli _ _ server describe 1234567
hetznercloud-cli _ _ network list
```

## Key Features
- **Servers** - Create, manage, delete
- **Networks** - Network management
- **Volumes** - Volume management
- **Firewalls** - Firewall rules
- **Load balancers** - LB management
- **Images** - Image management
- **Snapshots** - Snapshot management
- **Floating IPs** - IP management
- **Labels** - Label filtering
- **Output** - JSON/YAML output

## Notes
- Requires API token setup
- Great for infrastructure automation
- Supports label selectors
- Perfect for CI/CD pipelines
