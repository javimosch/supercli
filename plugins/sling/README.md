# sling Plugin for SuperCLI

[Sling](https://github.com/slingdata-io/sling-cli) is a lightweight ELT CLI
that moves data between databases, files, and storage systems — Postgres,
MySQL, Snowflake, BigQuery, DuckDB, S3, CSV/Parquet and more — driven by YAML
replication definitions or one-line ad-hoc runs.

## Installation

```bash
brew install slingdata-io/sling/sling
# or download sling_linux_amd64.tar.gz from GitHub releases
# or: go install github.com/slingdata-io/sling-cli/cmd/sling@latest

# Install supercli plugin
supercli plugins install ./plugins/sling
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli sling self version` | Show sling version |
| `supercli sling replication run` | Run a replication job |
| `supercli sling conn list` | List connections |
| `supercli sling conn set` | Add/update a connection |
| `supercli sling conn test` | Test connectivity |
| `supercli sling conn discover` | List source tables/streams |
| `supercli sling <any>` | Passthrough to sling CLI |

## Usage

```bash
# Configure + verify a connection
supercli sling conn set PG url='postgres://user:pass@host/db'
supercli sling conn test PG

# One-off table copy into DuckDB
supercli sling replication run --src-conn PG --src-stream public.users \
  --tgt-conn DUCKDB --tgt-object main.users
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
