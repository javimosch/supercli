# redpanda-connect Plugin for SuperCLI

[Redpanda Connect](https://github.com/redpanda-data/connect) (formerly **Benthos**)
is a declarative stream-processing and ETL engine. You write YAML pipelines that
connect 200+ inputs and outputs — Kafka, S3, Postgres, HTTP, files — with
Bloblang, a built-in mapping language, for transforming data in flight.

## Installation

```bash
# Install redpanda-connect (pick one)
brew install redpanda-data/tap/redpanda-connect
# or: go install github.com/redpanda-data/connect/v4/cmd/redpanda-connect@latest
# or: release tarball from github.com/redpanda-data/connect/releases

# Install supercli plugin
supercli plugins install ./plugins/redpanda-connect
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli redpanda-connect self version` | Show version |
| `supercli redpanda-connect pipeline run <cfg>` | Run a YAML pipeline |
| `supercli redpanda-connect config lint <cfg>` | Lint a config before running |
| `supercli redpanda-connect config create` | Print a template config |
| `supercli redpanda-connect components list [type]` | List inputs/outputs/processors |
| `supercli redpanda-connect streams run` | Streams mode (multiple pipelines + REST API) |
| `supercli redpanda-connect <any>` | Passthrough to the CLI |

## Usage

```bash
# Scaffold a starter config, then lint and run it
supercli redpanda-connect config create > pipeline.yaml
supercli redpanda-connect config lint pipeline.yaml
supercli redpanda-connect pipeline run pipeline.yaml

# Discover components
supercli redpanda-connect components list inputs
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
