---
name: fping
description: Use this skill when the user wants to ping many hosts, sweep a subnet for live machines, or measure latency/loss with fping.
---

# fping Plugin

fping pings multiple hosts in round-robin (unlike ping, which is sequential). It sweeps CIDR ranges, reads target lists from files/stdin, and prints per-host reachability and latency stats — ideal for host discovery and scripted health checks.

## Commands

### Pinging
- `fping host ping "<hosts>"` — Ping space-separated hosts
- `fping host alive [targets]` — Show only reachable hosts (`-a`)
- `fping sweep run <cidr>` — Generate + ping a range (`-g`)
- `fping latency stats "<hosts>"` — 10 probes/host with loss/avg/max (`-C 10 -q -s`)
- `fping _ _` — Passthrough to fping CLI

## Usage Examples

- "Which of these IPs are alive?"
- "Sweep 192.168.1.0/24 and list the live hosts"
- "Compare latency to these three DNS servers"
- "Ping everything in hosts.txt"

## Installation

```bash
sudo apt-get install -y fping
# or: sudo dnf install -y fping / apk add fping / brew install fping
```

## Examples

```bash
# Multiple hosts
fping 8.8.8.8 1.1.1.1 9.9.9.9

# Quiet: only alive hosts in a subnet
fping -a -g -q 192.168.1.0/24

# Targets from file, print unreachable
fping -u -f targets.txt

# Continuous loop with 1s interval
fping -l -i 1000 host1 host2

# Latency stats (10 probes, quiet, summary)
fping -C 10 -q -s host1 host2

# IPv6
fping -6 host.example.com
```

## Key Features

- Round-robin probing — dozens of hosts in the time ping checks one
- `-g` generates ranges from CIDR or start/end IPs
- `-a`/`-u` filter to alive/unreachable only; `-q` quiet mode for scripts
- `-f` reads target lists from files; also reads stdin
- `-C` per-host min/avg/max/loss stats; `-e` elapsed time; `-D` timestamps
