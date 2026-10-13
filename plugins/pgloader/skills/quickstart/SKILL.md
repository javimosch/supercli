---
name: pgloader
description: Use this skill when the user wants to migrate data from MySQL, SQLite, MS SQL, CSV, or dBase files into PostgreSQL with pgloader.
---

# pgloader Plugin

pgloader is a mature ETL tool focused on loading data into PostgreSQL. Given a source (database URL or file) and a Postgres target URL, it auto-discovers the source schema, converts types, creates tables/indexes, and loads rows with parallel COPY.

## Commands

- `pgloader migrate run <source> <target>` — Full migration into Postgres
- `pgloader migrate dryrun <source> <target>` — Process without writing (`--dry-run`)
- `pgloader load command <file.load>` — Run a .load command file (casting rules, filters)
- `pgloader encodings list` — Show supported source encodings
- `pgloader _ _` — Passthrough

## Usage Examples

- "Migrate this MySQL database to Postgres"
- "Load this CSV into a Postgres table"
- "Convert this SQLite file into Postgres"
- "Do a dry run of the migration first"

## Installation

```bash
sudo apt-get install -y pgloader
# or: brew install pgloader
```

## Examples

```bash
# Full MySQL -> Postgres migration
pgloader mysql://root:pass@localhost/sourcedb postgresql://postgres@localhost/destdb

# CSV file into Postgres
pgloader ./people.csv postgresql://localhost/analytics

# Dry run first
pgloader --dry-run sqlite:///app.db postgresql://localhost/appdb

# Advanced: .load file with casting rules
pgloader complex.load
```

## Key Features

- Sources: MySQL, SQLite, MS SQL Server, CSV, fixed-width, dBase (.dbf), IXF, archives
- Automatic schema discovery + Postgres type conversion
- `.load` command files for fine control: CAST rules, INCLUDING/EXCLUDING table filters, BEFORE/AFTER LOAD hooks
- `--dry-run` to validate without writing; `--verbose`/`--debug` for diagnostics
