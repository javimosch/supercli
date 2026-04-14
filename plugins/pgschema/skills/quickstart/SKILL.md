---
name: pgschema
description: Use this skill when the user wants to manage Postgres database schema migrations, dump schemas, create migration plans, or apply schema changes declaratively.
---

# pgschema Plugin

Terraform-style, declarative schema migration CLI for Postgres. Define desired schema state and pgschema generates the migration plan automatically.

## Commands

### Schema Management
- `pgschema schema dump` — Dump current database schema to SQL file
- `pgschema schema plan` — Diff schema against live database, generate migration plan
- `pgschema schema apply` — Apply migration plan to database
- `pgschema schema diff` — Show diff between schema file and live database

### Self
- `pgschema self version` — Print pgschema version

## Usage Examples

### Dump current schema
```bash
PGPASSWORD=$DB_PASSWORD pgschema dump --host localhost --db mydb --user postgres --schema public > schema.sql
```

### Generate migration plan
```bash
PGPASSWORD=$DB_PASSWORD pgschema plan --host localhost --db mydb --user postgres --schema public --file schema.sql --output-human stdout --output-json plan.json
```

### Apply migration with confirmation
```bash
PGPASSWORD=$DB_PASSWORD pgschema apply --host localhost --db mydb --user postgres --schema public --plan plan.json
```

### Apply migration automatically
```bash
PGPASSWORD=$DB_PASSWORD pgschema apply --host localhost --db mydb --user postgres --schema public --plan plan.json --auto-approve
```

## Installation

```bash
go install github.com/pgplex/pgschema@latest
```

## Key Features
- State-based schema management (like Terraform, not migration-file-based)
- Deep Postgres support: RLS, partitioning, triggers, partial indexes, sequences, policies
- No shadow database required for validation
- Plan/preview step before applying changes
- Supports Postgres versions 14-18
