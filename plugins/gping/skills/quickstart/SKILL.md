---
name: gping
description: Use this skill when the user wants to ping hosts with graph visualization, monitor network latency, or track packet loss over time.
---

# gping Plugin

Ping, but with a graph. Visual ping tool with real-time graph display for monitoring network latency and packet loss.

## Commands

### Network Monitoring
- `gping host ping` — Ping host with graph visualization

### Utility
- `gping _ _` — Passthrough to gping CLI

## Usage Examples
- "Ping with graph visualization"
- "Monitor network latency"
- "Track packet loss over time"
- "Ping multiple hosts simultaneously"

## Installation

```bash
brew install gping
```

Or via Cargo:
```bash
cargo install gping
```

## Examples

```bash
# Ping single host
gping host ping google.com

# Ping multiple hosts
gping host ping google.com cloudflare.com

# Set ping interval
gping host ping --interval 1s google.com

# Set number of pings
gping host ping --count 10 google.com

# Set timeout
gping host ping --timeout 2 google.com

# Disable IPv4
gping host ping --no-ipv4 google.com

# Disable IPv6
gping host ping --no-ipv6 google.com

# Use specific interface
gping host ping --interface eth0 google.com

# Any gping command with passthrough
gping _ _ google.com cloudflare.com
gping _ _ --interval 500ms --count 20 google.com
```

## Key Features
- **Real-time graph** - Visual ping latency over time
- **Multiple hosts** - Ping several hosts simultaneously
- **Color-coded** - Each host has unique color
- **Statistics** - Min/max/avg latency display
- **Packet loss** - Track lost packets
- **IPv4/IPv6** - Supports both protocols
- **Customizable** - Adjustable interval and timeout
- **Interface selection** - Choose network interface
- **Cross-platform** - Linux, macOS, Windows
- **TUI interface** - Interactive terminal display

## Notes
- Requires terminal with TUI support
- Graph updates in real-time
- Shows min/max/avg statistics
- Can be used for network troubleshooting
- Helps visualize network stability
