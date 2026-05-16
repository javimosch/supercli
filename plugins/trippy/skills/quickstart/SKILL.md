---
name: trippy
description: Use this skill when the user wants to run network traceroute diagnostics — trace hops, measure latency, check packet loss, and analyze routing paths.
---

# Trippy Plugin

Trippy is a network diagnostic tool that combines traceroute, ping, and path analysis. It supports multiple output modes including JSON, CSV, Markdown, and an interactive TUI.

## Commands

### Self
- `trippy self version` — Print trippy version

### Trace Operations
- `trippy trace json <target> [-C N]` — Traceroute with JSON output (machine-readable)
- `trippy trace pretty <target> [-C N]` — Traceroute with pretty text table
- `trippy trace csv <target> [-C N]` — Traceroute with CSV output

### Passthrough
- `trippy _ _ <args>` — Raw passthrough (tui, stream, markdown, dot, silent modes, etc.)

## Usage Examples

- "trace route to google.com and output JSON"
- "traceroute to 8.8.8.8 with 5 cycles"
- "run traceroute showing pretty text table"
- "check network path to example.com using UDP"
- "trace using IPv4 only"

## Installation

```bash
brew install trippy
# or download from GitHub releases
# https://github.com/fujiapple852/trippy/releases
```

## Key Features
- Combines traceroute + ping in one tool
- Multiple output modes: JSON, CSV, Markdown, pretty text, TUI
- Supports ICMP, UDP, and TCP protocols
- Per-hop latency, loss %, and hostname/IP information
- GeoIP support with MaxMind/IPinfo databases
- Streaming mode for continuous monitoring
- Interactive TUI with real-time charts
- Unprivileged mode on supported platforms
- IPv4, IPv6, and dual-stack support

## Output Modes

| Mode | Use case |
|------|----------|
| `json` | Machine-readable, scripting, automation |
| `pretty` | Human-readable text table |
| `csv` | Spreadsheet import, data pipelines |
| `markdown` | Documentation, reports |
| `tui` | Interactive real-time terminal UI |
| `stream` | Continuous streaming data |
| `dot` | Graphviz visualization |
| `silent` | No output, just data collection |

## Requirements
- For ICMP protocol: root/sudo or --unprivileged flag
- For UDP/TCP protocol: may also need privileges
- Network connectivity to the target host
