---
name: lazysql
description: Use this skill when the user wants a terminal UI to browse databases, run SQL, and edit records — connect to MySQL, PostgreSQL, SQLite, MSSQL, or MongoDB without a GUI client.
---

# lazysql Plugin

Cross-platform TUI database client. Browse schemas, run queries, edit rows, and switch connections — works over SSH with no desktop app required.

## Installation

```bash
brew install lazysql
# or
go install github.com/jorgerojas26/lazysql@latest
```

## Basic Usage

```bash
# Open TUI (configure connections interactively)
lazysql

# Connect directly via URL
lazysql postgres://user:pass@localhost/mydb
lazysql mysql://root@localhost:3306/app

# Read-only mode (no edits)
lazysql --read-only postgres://user@localhost/db
```

## Supported Databases

- PostgreSQL
- MySQL / MariaDB
- SQLite
- Microsoft SQL Server
- MongoDB

## Key Bindings (in TUI)

- Navigate tables and schemas with arrow keys
- Run SQL in the query pane
- Edit cells inline where supported
- `q` — Quit

## Usage Examples

- "Browse my local Postgres database in the terminal"
- "Run a quick SQL query without installing DBeaver"
- "Connect to production DB in read-only mode"

## SuperCLI

```bash
sc lazysql connection open postgres://user@localhost/db
sc plugins learn lazysql
```
