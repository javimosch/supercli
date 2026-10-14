# dagu Plugin for SuperCLI

[Dagu](https://github.com/dagu-org/dagu) is a self-contained workflow engine —
define DAGs in YAML, schedule them with cron syntax, and monitor runs in a
built-in web UI. A single binary with no external database makes it an easy
Airflow or crontab alternative.

## Installation

```bash
brew install dagu
# or: curl -L https://raw.githubusercontent.com/dagu-org/dagu/main/scripts/installer.sh | bash
# or: go install github.com/dagu-org/dagu/cmd/dagu@latest

# Install supercli plugin
supercli plugins install ./plugins/dagu
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli dagu self version` | Show dagu version |
| `supercli dagu dag start` | Start a DAG run |
| `supercli dagu dag status` | Latest run status |
| `supercli dagu dag retry` | Re-run a past execution |
| `supercli dagu dag stop` | Stop a running DAG |
| `supercli dagu server start-all` | Start web UI + scheduler |
| `supercli dagu <any>` | Passthrough to dagu CLI |

## Usage

```bash
# Trigger a workflow once
supercli dagu dag start backup.yaml

# Launch scheduler + dashboard on :8080
supercli dagu server start-all
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
