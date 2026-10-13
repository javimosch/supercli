---
name: pg-schema-diff
description: Use this skill when the user wants to diff Postgres schemas, generate validated migration plans, or dump a live schema to .sql files with Stripe's pg-schema-diff.
---

# pg-schema-diff Plugin

pg-schema-diff (by Stripe) generates Postgres migration plans by diffing a source schema (live DSN or dir of .sql files) against a target. Plans are validated against a temporary database exactly as they'd run, and hazards (index build hazards, lock risks, data-migration warnings) are flagged before apply.

## Commands

- `pg-schema-diff plan generate` — Diff and produce a plan (`--from-dsn`/`--from-dir` + `--to-dsn`/`--to-dir`, `--output-format pretty|json|sql`)
- `pg-schema-diff apply run` — Apply the migration (hazards must be approved)
- `pg-schema-diff schema dump` — Snapshot a live DB schema to .sql files
- `pg-schema-diff _ _` — Passthrough

## Usage Examples

- "Generate the migration to make this database match my schema files"
- "Dump this Postgres database's schema into files"
- "Diff the prod schema against what's in the repo"
- "Show the migration plan as JSON"

## Installation

```bash
brew install pg-schema-diff
# or: go install github.com/stripe/pg-schema-diff/cmd/pg-schema-diff@latest
```

## Examples

```bash
# Plan: live DB -> desired schema dir
pg-schema-diff plan \
  --from-dsn "postgres://postgres:postgres@localhost:5432/postgres" \
  --to-dir ./schema

# Machine-readable plan for agents/CI
pg-schema-diff plan --from-dsn "..." --to-dir ./schema --output-format json

# Snapshot live schema first (good baseline workflow)
mkdir -p schema && pg-schema-diff dump --dsn "..." --output-dir schema

# Apply with hazard approval
pg-schema-diff apply --from-dsn "..." --to-dir ./schema
```

## Key Features

- Sources: live database (--from-dsn/--to-dsn) or schema directories (--from-dir/--to-dir)
- Plans validated on a temp database before being shown
- Hazard detection: index build hazards, check-constraint rewrites, lock risks
- `--output-format json` for programmatic consumption
- Online index replacement: new index built before old one dropped
