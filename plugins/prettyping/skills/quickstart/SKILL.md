---
name: prettyping
description: Use this skill when the user wants to ping a host with colorful output, visualize network latency, diagnose connectivity issues, or get cleaner ping statistics.
---

# prettyping Plugin

A ping wrapper that adds colorful, informative output with live latency visualization, statistics, and a cleaner display.

## Commands

### Diagnostics
- `prettyping host ping` — Pretty-ping a host with colorful live output
- `prettyping self version` — Print prettyping version

### Utility
- `prettyping _ _` — Passthrough to prettyping CLI

## Usage Examples
- "Ping google.com with pretty output"
- "Check if the server is reachable"
- "Monitor network latency over time"
- "Visualize packet loss"

## Installation

```bash
curl -sL https://raw.githubusercontent.com/denilsonsa/prettyping/master/prettyping -o /usr/local/bin/prettyping
chmod +x /usr/local/bin/prettyping
```

## Examples

```bash
# Ping a host
prettyping host ping google.com

# Ping with limited count
prettyping host ping --count 10 google.com

# Set interval
prettyping host ping --interval 0.5 google.com

# Disable colors for logging
prettyping host ping --nocolor google.com

# Disable multiline output (useful for piped output)
prettyping host ping --nomultiline google.com

# Disable unicode symbols
prettyping host ping --nounicode google.com

# Passthrough any option
prettyping _ _ 8.8.8.8
```

## Key Features
- **Colorful output** — Color-coded latency values
- **Live visualization** — Unicode sparklines for latency trend
- **Statistics** — Min, max, avg, mdev at a glance
- **Clean display** — Less cluttered than standard ping
- **Packet loss** — Visual indicators for lost packets

## Notes
- A single-file Bash script wrapper around standard ping
- Requires `ping` to be installed on the system
- Supports both IPv4 and IPv6
- Works on Linux, macOS, and BSD

## Resources
- GitHub: https://github.com/denilsonsa/prettyping
