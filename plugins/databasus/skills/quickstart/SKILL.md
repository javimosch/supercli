---
name: databasus
description: Use this skill when the user wants to backup PostgreSQL databases with point-in-time recovery
---

# Databasus Plugin

backup PostgreSQL databases with point-in-time recovery

## Commands
- `databasus self version` — Print databasus version
- `databasus _ _` — Passthrough to databasus CLI

## Usage Examples
- "Backup this PostgreSQL database"
- "Restore to a specific point in time"
- "List available backups"

## Installation

```bash
go install github.com/nicholasgasior/databasus@latest
```

## Examples
```bash
databasus backup --db mydb
databasus restore --to "2024-01-15 10:30:00"
databasus list
```

## Key Features
- Continuous WAL archiving
- Point-in-time recovery
- Incremental backups
- S3/local storage support
