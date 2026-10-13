---
name: dbt
description: Use this skill when the user wants to run, test, or debug dbt data transformations — SQL models compiled and executed against a warehouse.
---

# dbt Plugin

dbt Core compiles `select` statements (models) into your warehouse's SQL, executes them in DAG order, and tests the results. It needs a `dbt_project.yml` (project root) and a `profiles.yml` connection profile; adapters provide warehouse connectivity.

## Commands

### Lifecycle
- `dbt project init` — Scaffold a new project
- `dbt debug check` — Validate profiles.yml + connection
- `dbt deps install` — Install packages.yml deps
- `dbt parse run` — Parse project (fast syntax/manifest check)

### Execution
- `dbt models run` — Run models (`--select` to filter, e.g. `--select staging+`)
- `dbt tests run` — Run tests
- `dbt build run` — Everything in DAG order
- `dbt docs generate` — catalog.json + manifest.json
- `dbt _ _` — Passthrough (seed, snapshot, compile, ls, show, etc.)

## Usage Examples

- "Run the dbt models in this project"
- "Test the orders model and its children"
- "Check if my dbt profile is configured right"
- "List dbt models as JSON for scripting"

## Installation

```bash
pipx install dbt-core
pipx inject dbt-core dbt-postgres   # adapter REQUIRED
# alternatives: dbt-duckdb, dbt-snowflake, dbt-bigquery
```

## Examples

```bash
# Validate connection first
dbt debug

# Run a slice of the DAG
dbt run --select +fact_orders
dbt test --select source:raw

# Dry-check syntax without running
dbt parse

# Agent-friendly introspection
dbt ls --resource-type model --output json
dbt show --inline "select * from {{ ref('stg_users') }} limit 5"
```

## Key Features

- Jinja-templated SQL compiles per-warehouse dialect
- Node selection syntax (`+model`, `model+`, `tag:x`, `source:y`) for surgical runs
- Built-in generic tests: unique, not_null, accepted_values, relationships
- `dbt ls --output json` exposes the project graph for scripting
