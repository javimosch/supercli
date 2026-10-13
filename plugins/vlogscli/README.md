# vlogscli Plugin for SuperCLI

[vlogscli](https://github.com/VictoriaMetrics/VictoriaLogs) is the official query CLI for
VictoriaLogs. It runs an interactive pager with LogsQL autocomplete, or reads one-shot
queries from stdin — ideal for scripts and AI agents. Uses single-dash Go flags.

## Installation

```bash
# Install vlogscli binary (pick one)
go install github.com/VictoriaMetrics/VictoriaLogs/app/vlogscli@latest
# or grab vlogscli-linux-amd64 assets from
# github.com/VictoriaMetrics/VictoriaLogs/releases

# Install supercli plugin
supercli plugins install ./plugins/vlogscli
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli vlogscli self version` | Show vlogscli version |
| `supercli vlogscli query run` | Query non-interactively (stdin LogsQL + `-datasource.url`) |
| `supercli vlogscli <any>` | Passthrough to vlogscli CLI |

## Usage

```bash
# One-shot LogsQL query via stdin
echo '_time:1h error' | supercli vlogscli query run -- -datasource.url=http://localhost:9428

# Interactive
supercli vlogscli query run -- -datasource.url=http://localhost:9428
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
