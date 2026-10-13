---
name: powerpipe
description: Use this skill when the user wants SQL-powered dashboards, compliance benchmarks, or ad-hoc queries over Postgres/SQLite/DuckDB with Powerpipe.
---

# powerpipe Plugin

Powerpipe (Turbot, makers of Steampipe) turns SQL queries into dashboards and benchmarks-as-code. `.pp` mod files define dashboards, controls, and benchmarks; the CLI runs them against a database and renders interactively or exports JSON snapshots.

## Commands

### Queries
- `powerpipe query run "<sql>"` — Run SQL; add `--output json|csv` and `--database <dsn>`
- `powerpipe dashboard run` — Run/snapshot a dashboard
- `powerpipe benchmark run` — Run compliance benchmarks/controls

### Mods & server
- `powerpipe mod init` — Scaffold powerpipe.mod
- `powerpipe mod install` — Install mod dependencies
- `powerpipe server start` — Dashboard server on :9033
- `powerpipe _ _` — Passthrough (control run, check all, etc.)

## Usage Examples

- "Run this SQL and give me JSON"
- "Start the dashboard server for this mod"
- "Run the compliance benchmark and export results"
- "Initialize a powerpipe mod here"

## Installation

```bash
sudo /bin/sh -c "$(curl -fsSL https://powerpipe.io/install/powerpipe.sh)"
# or: brew install turbot/tap/powerpipe
```

## Examples

```bash
# Ad-hoc query over Postgres, JSON output
powerpipe query run "select * from orders limit 5" \
  --database postgres://localhost/analytics --output json

# SQLite file, no server
powerpipe query run "select count(*) from t" --database sqlite://app.db

# Mod workflow
powerpipe mod init
powerpipe mod install
powerpipe benchmark run --output json
powerpipe server  # http://localhost:9033
```

## Key Features

- Dashboards/benchmarks defined as code in `.pp` files (version-controllable)
- Backends: Postgres, SQLite, MySQL, DuckDB — `--database` or POWERPIPE_DATABASE_URL
- `--output json` snapshots for CI/automation; interactive server on :9033
- Compatible with Steampipe mods ecosystem (AWS/Azure/GCP compliance benchmarks)
