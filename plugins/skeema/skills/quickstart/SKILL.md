---
name: skeema
description: Use this skill when the user wants declarative schema management, schema diffs, or migrations for MySQL/MariaDB with skeema.
---

# skeema Plugin

skeema manages MySQL/MariaDB schemas declaratively: table definitions live as `CREATE` statements in `.sql` files under git, and skeema computes/applies the DDL to converge databases to the repo state. Environments (dev/staging/prod) are defined in `.skeema` config files.

## Commands

### Setup
- `skeema repo init --host <h>` — Dump live server schemas into a new skeema repo

### Workflow (run inside a skeema repo dir)
- `skeema diff preview` — Preview pending DDL (safe dry run)
- `skeema push apply` — Apply the schema changes
- `skeema format run` — Canonicalize .sql file formatting
- `skeema lint run` — Check for errors/unsafe changes
- `skeema pull run` — Sync repo with out-of-band DB changes
- `skeema _ _` — Passthrough (skeema help, add-environment, etc.)

## Usage Examples

- "Dump this MySQL schema into files I can commit"
- "What DDL will run if I apply these schema changes?"
- "Push the new table definition to staging"
- "Format the schema files"

## Installation

```bash
go install github.com/skeema/skeema@latest
# or: brew install skeema
# or: static binary tarball from GitHub releases
```

## Examples

```bash
# Initialize from a live server
skeema init --host db.internal --user root --dir schemas

# Typical edit -> preview -> apply loop
vim schemas/mydb/users.sql
skeema diff        # preview
skeema push        # apply
skeema lint        # validate

# Format canonical CREATE statements
skeema format
```

## Key Features

- Declarative: edit CREATE statements, skeema computes ALTERs
- Multi-environment via .skeema option files and --dir per env
- Online schema change support (pt-osc / gh-ost integration)
- Safe dry-run `skeema diff` before every `skeema push`
- Lint catches unsafe changes and SQL errors pre-push
