---
name: dagu
description: Use this skill when the user wants to run, schedule, or monitor YAML-defined workflows/DAGs — a lightweight Airflow/cron alternative with a built-in web UI and no database requirement.
---

# dagu Plugin

Dagu is a self-contained workflow engine. You define DAGs in YAML files, it schedules them with cron expressions, runs steps with dependencies/retries/parallelism, and shows everything in a built-in web dashboard. Single binary, state stored as files — no Postgres or Redis needed.

## Commands

- `dagu dag start` — Trigger a DAG run (`dagu start file.yaml [--params ...]`)
- `dagu dag status` — Latest run status and per-step state
- `dagu dag retry` — Re-run a past execution (`--req=<id>`)
- `dagu dag stop` — Stop a running execution
- `dagu server start-all` — Web UI + scheduler together (`:8080`)
- `dagu _ _` — Passthrough to dagu CLI (dry, validate, scheduler, server)

## Usage Examples

- "Run this backup DAG and tell me if it succeeded"
- "Schedule my ETL pipeline to run every night at 2am"
- "Show the status of the last run of workflow.yaml"

## Installation

```bash
brew install dagu
# or: curl -L https://raw.githubusercontent.com/dagu-org/dagu/main/scripts/installer.sh | bash
# or: go install github.com/dagu-org/dagu/cmd/dagu@latest
```

## Examples

```yaml
# backup.yaml — a minimal DAG
schedule: "0 2 * * *"
steps:
  - name: dump
    command: pg_dump db > /tmp/db.sql
  - name: upload
    command: aws s3 cp /tmp/db.sql s3://backups/
    depends: dump
```

```bash
# One-off run, bypassing the scheduler
dagu start backup.yaml

# Dry-run to check the DAG definition
dagu dry backup.yaml

# Launch scheduler + dashboard (http://127.0.0.1:8080)
dagu start-all
```

## Key Features

- Cron-style scheduling, step dependencies, retries, timeouts, parallelism
- Executors: shell, ssh, docker, http, jq, mail — no Python DAGs to babysit
- History, logs, and retries persisted as local files (DAGU_HOME)
- Ideal Airflow/Crontab replacement for small deployments and edge boxes
