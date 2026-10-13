---
name: nexttrace
description: Use this skill when the user wants to run a traceroute, inspect network paths, or map routes with GeoIP/BGP data using nexttrace.
---

# nexttrace Plugin

NextTrace is an open-source visual traceroute (Go). Each hop is enriched with GeoIP location and BGP ASN data; supports ICMP, TCP and UDP probes, a world-map view, and JSON output.

## Commands

### Tracing
- `nexttrace trace run <host>` — Default ICMP traceroute
- `nexttrace trace tcp <host>` — TCP SYN traceroute (`--port 443` to set port)
- `nexttrace trace json <host>` — Machine-readable JSON output
- `nexttrace trace map <host>` — Render hops on a world map
- `nexttrace _ _` — Passthrough to nexttrace CLI

## Usage Examples

- "Trace the route to cloudflare-dns.com"
- "Why is latency to this host high? Show me the hops"
- "Get the traceroute as JSON"
- "Map the route to my server"

## Installation

```bash
bash -c "$(curl -Ls https://nxtrace.org/nt)"
# or: brew install nexttrace
# or: GitHub releases (linux_amd64/arm64, darwin, windows)
```

## Examples

```bash
# ICMP trace (default)
nexttrace 8.8.8.8

# TCP trace to a specific port
nexttrace --tcp --port 443 example.com

# JSON for scripting
nexttrace --json example.com

# Fast mode (fewer queries), UDP probe
nexttrace --fast-trace --udp example.com

# World-map visualization
nexttrace --map example.com
```

## Key Features

- ICMP, TCP SYN, and UDP probing modes
- Per-hop GeoIP location and BGP AS number/path
- `--json` output for pipelines and agents
- `--map` renders the route on a world map
- Single static binary, no dependencies
