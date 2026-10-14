# pwru Plugin for SuperCLI

[pwru](https://github.com/cilium/pwru) ("packet, where are you") is Cilium's
eBPF packet tracer. It follows packets through every kernel networking
function they touch and pinpoints the exact location where a packet is
dropped — the fastest way to answer "why is this traffic being dropped?"

## Installation

```bash
go install github.com/cilium/pwru/cmd/pwru@latest
# or download from https://github.com/cilium/pwru/releases
# Requires Linux >= 5.4 with BTF; run as root

# Install supercli plugin
supercli plugins install ./plugins/pwru
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli pwru self version` | Show pwru version |
| `supercli pwru self help` | All filter/output flags |
| `supercli pwru trace run` | Trace packets (Ctrl-C to stop) |
| `supercli pwru <any>` | Passthrough to pwru CLI |

## Usage

```bash
# Where do packets to :443 get dropped?
sudo supercli pwru trace run --filter-dst-port 443 --output-tuple

# In another shell, generate traffic, then Ctrl-C to inspect
curl -k https://this-host:443
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
