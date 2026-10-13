# promtail Plugin for SuperCLI

[Promtail](https://github.com/grafana/loki) is the log shipping agent for Grafana Loki.
It discovers targets (files, systemd journal, syslog), applies pipeline stages and
relabeling, and pushes entries to a Loki endpoint. Uses single-dash Go-style flags.

## Installation

```bash
# Install promtail binary
curl -O -L https://github.com/grafana/loki/releases/latest/download/promtail-linux-amd64.zip
unzip promtail-linux-amd64.zip
chmod +x promtail-linux-amd64 && mv promtail-linux-amd64 ~/.local/bin/promtail

# Install supercli plugin
supercli plugins install ./plugins/promtail
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli promtail self version` | Show promtail version |
| `supercli promtail config print` | Print resolved config |
| `supercli promtail config dryrun` | Validate config + list targets (`-dry-run`) |
| `supercli promtail agent run` | Run the agent (`-config.file`) |
| `supercli promtail <any>` | Passthrough to promtail CLI |

## Usage

```bash
supercli promtail config dryrun -- -config.file promtail.yaml -inspect
supercli promtail agent run -- -config.file promtail.yaml -log.level debug
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
