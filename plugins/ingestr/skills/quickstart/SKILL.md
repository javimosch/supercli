---
name: ingestr
description: Use this skill when the user wants to copy and sync data between databases
---

# Ingestr Plugin

copy and sync data between databases

## Commands
- `ingestr self version` — Print ingestr version
- `ingestr _ _` — Passthrough to ingestr CLI

## Usage Examples
- "Copy data from PostgreSQL to S3"
- "Sync MySQL to SQLite"
- "Migrate data between databases"

## Installation

```bash
pip install ingestr
```

## Examples
```bash
ingestr source postgres://localhost/mydb --dest s3://bucket/data
ingestr sync mysql://host/db --dest sqlite:///local.db
```

## Key Features
- Multi-database support
- Incremental sync
- Schema migration
- S3/cloud storage support
