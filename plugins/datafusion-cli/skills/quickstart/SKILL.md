---
name: datafusion-cli
description: Use this skill when the user wants to run SQL queries against CSV, Parquet, JSON, or Avro files without a database server, using Apache DataFusion's CLI.
---

# datafusion-cli Plugin

datafusion-cli embeds the Apache DataFusion query engine (Arrow-based, vectorized) in a standalone CLI. Register data files as external tables and query them with standard SQL — a fast, serverless alternative to spinning up DuckDB/Postgres for file analytics.

## Commands

- `datafusion-cli query exec "<sql>"` — Non-interactive SQL (add `--format json|csv|nd-json` for scripting)
- `datafusion-cli file run <script.sql>` — Execute a SQL file
- `datafusion-cli repl open [--data-path dir]` — Interactive REPL
- `datafusion-cli _ _` — Passthrough

## Usage Examples

- "Query this Parquet file with SQL"
- "Join a CSV and a JSON file"
- "Run this SQL script over the data in ./data"
- "Count rows in this parquet file"

## Installation

```bash
cargo install datafusion-cli
# or: brew install datafusion
```

## Examples

```bash
# Parquet via external table DDL
datafusion-cli -c "CREATE EXTERNAL TABLE hits STORED AS PARQUET LOCATION 'hits.parquet'; SELECT * FROM hits LIMIT 5;"

# CSV/JSON quoted directly in FROM (single quotes around path)
datafusion-cli -c "SELECT * FROM 'data.csv' LIMIT 10;"
datafusion-cli -c "SELECT user, count(*) FROM 'logs.json' GROUP BY user;"

# Machine-readable output
datafusion-cli -c "SELECT * FROM 'x.parquet'" --format nd-json

# A directory of files becomes the default catalog
datafusion-cli --data-path ./parquet_dir
```

## Key Features

- Formats: Parquet, CSV, JSON (nd-json), Avro, Arrow IPC
- `CREATE EXTERNAL TABLE ... STORED AS PARQUET|CSV|JSON LOCATION 'path'`
- `--format json|csv|nd-json` for agent/script-friendly output
- Full ANSI SQL: joins, aggregations, window functions, CTEs
