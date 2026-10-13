# fping Plugin for SuperCLI

[fping](https://github.com/schweikert/fping) is a script-friendly ICMP ping that probes
many hosts in round-robin instead of sequentially. It sweeps CIDR ranges, reads target
lists from files or stdin, and reports per-host reachability plus loss and latency stats —
the standard building block for host discovery and network health checks.

## Installation

```bash
# Install fping binary (pick one)
sudo apt-get install -y fping
# or: sudo dnf install -y fping
# or: brew install fping

# Install supercli plugin
supercli plugins install ./plugins/fping
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli fping self version` | Show fping version |
| `supercli fping host ping <hosts>` | Ping one or more hosts |
| `supercli fping sweep run <cidr>` | Discover live hosts in a range |
| `supercli fping host alive [hosts]` | Show only reachable hosts |
| `supercli fping latency stats <hosts>` | 10-probe latency/loss stats per host |
| `supercli fping <any>` | Passthrough to fping CLI |

## Usage

```bash
# Which hosts are up?
supercli fping host ping "192.168.1.1 192.168.1.2 8.8.8.8"

# Sweep a subnet
supercli fping sweep run 192.168.1.0/24

# Only the reachable ones
supercli fping host alive 192.168.1.0/24 -g

# Latency stats
supercli fping latency stats "1.1.1.1 8.8.8.8"

# Read targets from a file
supercli fping _ _ _args="-f hosts.txt -a -q"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
