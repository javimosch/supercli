---
name: furious
description: Use this skill when the user wants to scan network ports, check open ports, scan IP ranges, or perform network reconnaissance.
---

# furious Plugin

Go IP/port scanner with SYN (stealth) scanning and device manufacturer identification. Fast network scanning tool.

## Commands

### Port Scanning
- `furious scan ports` — Scan IP addresses and ports

### Utility
- `furious _ _` — Passthrough to furious CLI

## Usage Examples
- "Scan this host for open ports"
- "Check port 80 on this server"
- "Scan a network range"
- "Find open ports"

## Installation

```bash
go install github.com/liamg/furious@latest
```

## Examples

```bash
# Scan single host
furious scan ports 192.168.1.1

# Scan specific ports
furious scan ports 192.168.1.1 -p 80,443,22

# Scan with SYN (stealth) - requires root
sudo furious scan ports 192.168.1.1 -s syn

# Scan with connect mode (no root needed)
furious scan ports 192.168.1.1 -s connect

# Scan CIDR range
furious scan ports 192.168.1.0/24

# Set timeout
furious scan ports 192.168.1.1 -t 2000

# Scan multiple hosts
furious scan ports 192.168.1.1 192.168.1.2 example.com

# Identify devices on local network
furious scan ports 192.168.1.0/24

# Any furious command with passthrough
furious _ _ 192.168.1.1 -p 1-1000
furious _ _ --scan-type syn example.com
```

## Key Features
- **SYN scanning** - Stealth scanning (requires root)
- **Connect scanning** - Works without root
- **Fast** - Efficient scanning
- **CIDR support** - Scan network ranges
- **Port ranges** - Scan multiple ports
- **Device identification** - MAC and manufacturer
- **Timeout control** - Adjustable timeouts
- **Multiple targets** - Scan hosts at once

## Scan Types
- **SYN** - Stealth scan (requires sudo)
- **Connect** - Standard scan (no root needed)

## Notes
- SYN scan requires root/sudo
- Connect scan works for any user
- Can identify device manufacturers locally
- Great for security auditing
- Use responsibly on networks you own
