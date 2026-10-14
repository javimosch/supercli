# toxiproxy Plugin for SuperCLI

[Toxiproxy](https://github.com/Shopify/toxiproxy) is Shopify's TCP proxy for
chaos engineering. Proxies sit between an app and its dependencies so you can
inject latency, jitter, bandwidth caps, timeouts, or connection resets — and
prove your resilience code actually works.

## Installation

```bash
brew install toxiproxy
# or download toxiproxy-cli + toxiproxy-server from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/toxiproxy
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli toxiproxy self version` | Show toxiproxy-cli version |
| `supercli toxiproxy server start` | Run the daemon (:8474) |
| `supercli toxiproxy proxy create` | Create a proxy |
| `supercli toxiproxy proxy list` | List proxies |
| `supercli toxiproxy proxy inspect` | Proxy details + toxics |
| `supercli toxiproxy proxy toggle` | Simulate an outage |
| `supercli toxiproxy toxic add` | Attach a fault to a proxy |
| `supercli toxiproxy <any>` | Passthrough to toxiproxy-cli |

## Usage

```bash
# Daemon first, then proxy a local service
supercli toxiproxy server start &
supercli toxiproxy proxy create redis --listen localhost:26379 --upstream localhost:6379
supercli toxiproxy toxic add redis --type latency --attribute latency=1000
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
