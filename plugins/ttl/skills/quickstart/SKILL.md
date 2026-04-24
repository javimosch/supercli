---
name: ttl
description: Use this skill when the user wants to run traceroute, inspect network routes, measure per-hop latency, detect ECMP paths, or perform ASN/geo lookups.
---

# ttl Plugin

Fast, modern traceroute with per-hop stats, ASN/geo lookup, ECMP detection, and MPLS label parsing. Supports headless JSON, CSV, and text report output for use in CI and scripting pipelines.

## Commands

### Tracing
- `ttl host trace` — Run traceroute to a host and display results
- `ttl trace replay` — Replay a saved traceroute session from JSON
- `ttl self version` — Print ttl version
- `ttl _ _` — Passthrough to ttl CLI

## Usage Examples
- "Trace the route to google.com"
- "Run traceroute to 1.1.1.1 and export as JSON"
- "Generate a CSV report of a network trace"
- "Replay a saved traceroute session"

## Installation

```bash
brew install lance0/tap/ttl
```

## Examples

```bash
# Basic traceroute to a host
ttl host trace google.com

# Export results as JSON with 100 probe packets per hop
ttl host trace 1.1.1.1 -c 100 --json

# Generate a text report
ttl host trace 1.1.1.1 -c 100 --report

# Export as CSV
ttl host trace 1.1.1.1 --csv

# TCP probes to port 443
ttl host trace google.com -p tcp --port 443

# ECMP path enumeration with 4 flows
ttl host trace google.com --flows 4

# Bind to specific interface
ttl host trace google.com --interface eth0

# Large packets for MTU testing
ttl host trace google.com --size 1400

# QoS marking
ttl host trace google.com --dscp 46

# Replay a saved session
ttl trace replay results.json

# Animate a replay
ttl trace replay results.json --animate
```

## Key Features
- Per-hop latency statistics with min/avg/max
- ASN and geolocation lookup for each hop
- ECMP (Equal-Cost Multi-Path) detection
- MPLS label parsing
- ICMP, UDP, and TCP protocol support
- JSON, CSV, and text report export
- Session replay from saved JSON
- Real-time TUI (optional, can run headless)
- Custom packet size and QoS marking

## Notes
- Raw sockets require elevated privileges on Linux
- Add capability once: `sudo setcap cap_net_raw+ep $(which ttl)`
- Then run without sudo
