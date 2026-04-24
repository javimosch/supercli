---
name: bandwhich
description: Use this skill when the user wants to monitor network bandwidth utilization, see which processes are using network, or diagnose network usage by connection.
---

# bandwhich Plugin

Terminal bandwidth utilization tool. Display network utilization by process, connection, and remote IP/hostname with real-time monitoring.

## Commands

### Network Monitoring
- `bandwhich network monitor` — Monitor network utilization in real-time

### Utility
- `bandwhich _ _` — Passthrough to bandwhich CLI

## Usage Examples
- "Monitor network usage"
- "See process bandwidth"
- "Network utilization tool"
- "Bandwidth by connection"

## Installation

```bash
brew install bandwhich
```

Or via Cargo:
```bash
cargo install bandwhich
```

May require root/admin privileges on some systems.

## Examples

```bash
# Monitor all interfaces
bandwhich network monitor

# Monitor specific interface
bandwhich network monitor --interface eth0

# Raw output without TUI
bandwhich network monitor --raw

# With DNS resolution
bandwhich network monitor --dns

# Any bandwhich command with passthrough
bandwhich _ _ --raw --interface wlan0
bandwhich _ _ --dns --no-resolve
```

## Key Features
- **Processes** - Per-process usage
- **Connections** - Per-connection usage
- **Remote** - Remote host tracking
- **Real-time** - Live monitoring
- **Bandwidth** - Up/down speeds
- **TUI** - Terminal UI
- **Raw** - Raw output mode
- **DNS** - DNS resolution
- **Interfaces** - Multi-interface
- **Sorting** - Sortable columns

## Notes
- May require root for packet capture
- Shows per-process bandwidth
- Great for network debugging
- Works on Linux, macOS, Windows
