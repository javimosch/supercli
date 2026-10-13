---
name: tbls
description: Use this skill when the user wants to document a database schema, lint a schema, or diff a database against generated docs with tbls.
---

# tbls Plugin

tbls generates CI-friendly Markdown documentation of database schemas (tables, columns, indexes, constraints, relations, ER diagrams) and can lint schemas or diff a live database against its docs. Works with PostgreSQL, MySQL, SQLite, BigQuery, Snowflake, and more.

## Commands

### Documentation
- `tbls docs generate <dsn>` — Generate schema docs (output dir from arg or tbls.yml)
- `tbls schema out <dsn>` — Dump schema; add `-t json` for machine-readable output
- `tbls _ _` — Passthrough (tbls ls, tbls doc --force, tbls config, etc.)

### Quality
- `tbls lint run <dsn>` — Check schema against lint rules in tbls.yml
- `tbls diff check <dsn>` — Show drift between database and generated docs

## Usage Examples

- "Generate ER diagram docs for this Postgres database"
- "Lint the schema for missing table comments"
- "Export the SQLite schema as JSON"
- "Check if the docs are out of date with the database"

## Installation

```bash
go install github.com/k1LoW/tbls@latest
# or: brew install k1LoW/tap/tbls
```

## Examples

```bash
# Document a Postgres database
tbls doc postgres://user:pass@localhost:5432/mydb ./docs/schema

# Document a SQLite database
tbls doc sqlite://./app.db

# Schema as JSON for scripting
tbls out -t json postgres://localhost/mydb

# Lint with tbls.yml rules (comments, column counts, etc.)
tbls lint postgres://localhost/mydb
```

## Key Features

- Supports PostgreSQL, MySQL, SQLite, BigQuery, Snowflake, SQL Server, and more
- Generates Markdown docs with ER diagrams (mermaid/graphviz)
- `tbls.yml` config for datasources, lint rules, and doc settings
- `tbls out -t json` gives an agent-friendly machine-readable schema dump
