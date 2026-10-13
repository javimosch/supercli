# process-compose Plugin for SuperCLI

[Process Compose](https://github.com/F1bonacc1/process-compose) is a Docker Compose-style
scheduler for non-containerized processes. A `process-compose.yaml` defines dependencies
(`depends_on`), health checks, restart policies, and env; it runs with an interactive TUI
or headless with a REST API and JSON output.

## Installation

```bash
# Install process-compose (pick one)
sh -c "$(curl --location https://raw.githubusercontent.com/F1bonacc1/process-compose/main/scripts/get-pc.sh)" -- -d -b ~/.local/bin
# or: brew install f1bonacc1/tap/process-compose
# or: go install github.com/f1bonacc1/process-compose@latest

# Install supercli plugin
supercli plugins install ./plugins/process-compose
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli process-compose self version` | Show version |
| `supercli process-compose project up` | Start processes (`--tui=false` headless) |
| `supercli process-compose project down` | Stop all processes |
| `supercli process-compose project info` | Project info (`-o json`) |
| `supercli process-compose process list` | Process states (`-o json`) |
| `supercli process-compose process restart` | Restart one process |
| `supercli process-compose process logs` | Fetch process logs |
| `supercli process-compose <any>` | Passthrough to process-compose CLI |

## Usage

```bash
supercli process-compose project up -- --tui=false &
supercli process-compose process list -- -o json
supercli process-compose process restart api
supercli process-compose project down
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
