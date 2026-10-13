# nexttrace Plugin for SuperCLI

[NextTrace](https://github.com/nxtrace/NTrace-core) is an open-source visual traceroute
written in Go. It enriches each hop with GeoIP and BGP/ASN data, supports ICMP, TCP and
UDP probing, and can render routes on a world map or emit JSON for pipelines.

## Installation

```bash
# Install nexttrace binary (pick one)
bash -c "$(curl -Ls https://nxtrace.org/nt)"
# or: brew install nexttrace
# or: download from https://github.com/nxtrace/NTrace-core/releases

# Install supercli plugin
supercli plugins install ./plugins/nexttrace
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli nexttrace self version` | Show nexttrace version |
| `supercli nexttrace trace run <host>` | ICMP traceroute to a host |
| `supercli nexttrace trace tcp <host>` | TCP SYN traceroute |
| `supercli nexttrace trace json <host>` | Traceroute with JSON output |
| `supercli nexttrace trace map <host>` | Traceroute on a world map |
| `supercli nexttrace <any>` | Passthrough to nexttrace CLI |

## Usage

```bash
# Basic trace
supercli nexttrace trace run 1.1.1.1

# TCP trace to port 443
supercli nexttrace trace tcp example.com --port 443

# JSON output for scripting
supercli nexttrace trace json example.com

# UDP probe, fast-trace mode
supercli nexttrace _ _ _args="--udp --fast-trace example.com"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
