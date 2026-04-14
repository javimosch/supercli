---
name: xfr
description: Use this skill when the user wants to test network bandwidth, benchmark connections, compare network performance results, or measure throughput with a live TUI.
---

# Xfr Plugin

A modern iperf3 alternative with a live TUI, multi-client server, and QUIC support. Built in Rust.

## Commands

### Server
- `xfr serve start` — Start xfr server for bandwidth testing

### Client Testing
- `xfr client test` — Run bandwidth test to xfr server

### Result Comparison
- `xfr diff compare` — Compare two bandwidth test results

### LAN Discovery
- `xfr discover find` — Find xfr servers on LAN via mDNS

## Usage Examples

Start server:
```
xfr serve
xfr serve -p 9000
xfr serve --tui
xfr serve --prometheus 9090
```

Run bandwidth test:
```
xfr 192.168.1.1
xfr 192.168.1.1 -t 30s -b 100M
xfr 192.168.1.1 -P 4 -R
xfr 192.168.1.1 -u -b 1G
xfr 192.168.1.1 --quic -P 4
```

Output formats:
```
xfr 192.168.1.1 --json -o results.json
xfr 192.168.1.1 --csv -o results.csv
```

Compare results:
```
xfr diff baseline.json current.json
xfr diff before.json after.json --threshold 5
```

Discover servers:
```
xfr discover
```

## Installation

```bash
cargo install xfr
```

Or via package manager:
```bash
brew install lance0/tap/xfr
eget lance0/xfr
```

## Key Features
- Live TUI with real-time throughput graphs
- Multi-client server (vs iperf3 single client)
- TCP, UDP, QUIC, and MPTCP support
- Parallel streams for bonded connections
- Multiple output formats (text, JSON, CSV)
- Result comparison with `xfr diff`
- LAN discovery via mDNS
- Prometheus metrics export
- 11 built-in color themes
- Firewall-friendly single-port mode