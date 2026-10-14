---
name: sling
description: Use this skill when the user wants to move or replicate data between databases, files, or cloud storage — e.g. Postgres to Snowflake, CSV to DuckDB — using a single binary and YAML replication configs.
---

# sling Plugin

Sling is a self-contained ELT CLI. Define a connection once, then run ad-hoc syncs or YAML replications between 30+ endpoints: relational DBs, warehouses, files (CSV/Parquet/JSON/Excel), object storage, and messaging systems.

## Commands

- `sling replication run` — Run `-r replication.yaml` or an ad-hoc src→tgt job
- `sling conn list` — Configured connections
- `sling conn set` — Add/update a named connection
- `sling conn test` — Verify connectivity
- `sling conn discover` — List schemas/tables in a source
- `sling _ _` — Passthrough to sling CLI

## Usage Examples

- "Copy the public.users table from Postgres into DuckDB"
- "Replicate these three MySQL schemas to Snowflake nightly"
- "Dump this query result to a Parquet file in S3"

## Installation

```bash
brew install slingdata-io/sling/sling
# or download sling_linux_amd64.tar.gz from GitHub releases
sling --version
```

## Examples

```bash
# Register connections once
sling conns set PG url='postgres://user:pass@host:5432/db'
sling conns set DUCKDB url='duckdb:///tmp/db.duckdb'

# Ad-hoc one-off copy
sling run --src-conn PG --src-stream public.users --tgt-conn DUCKDB --tgt-object main.users

# Declarative replication.yaml
# source: PG
# target: DUCKDB
# streams:
#   public.*:
#     mode: incremental
#     primary_key: id
#     update_key: updated_at
sling run -r replication.yaml
```

## Key Features

- Modes: full-refresh, incremental, snapshot, truncate, backfill
- Hooks: pre/post SQL, notifications on success/failure
- SQL streams supported as sources (`select ...`)
- Single static binary — great cron/systemd citizen
- `--select` for stream filtering; `sling conns discover` for inventory
