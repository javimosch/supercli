---
name: turso-cli
description: Use this skill when the user wants to create or manage Turso libSQL/SQLite databases, configure replicas, or get database connection URLs.
---

# Turso CLI

Manage libSQL/SQLite databases, replicas, and groups from the terminal.

## Commands

- `turso-cli db list` — List databases
- `turso-cli db create` — Create a new database
- `turso-cli db shell` — Open a SQL shell
- `turso-cli _ _` — Passthrough to turso CLI

## Installation

```bash
brew install tursodatabase/tap/turso
```

## Authentication

```bash
turso auth login
# or set TURSO_API_TOKEN
```

## Usage Examples

- "List my Turso databases"
- "Create a new SQLite database"
- "Open a SQL shell to my database"
- "Get a database token"

## Key Commands

```bash
# List databases
turso db list

# Create database
turso db create my-database

# Get database info
turso db show my-database

# Create auth token
turso db tokens create my-database

# SQL shell
turso db shell my-database

# Manage groups
turso group list
turso group create my-group --location ord
```

## Key Features
- **libSQL/SQLite** - Edge database
- **Replicas** - Global replication
- **Groups** - Database grouping
- **JSON Output** - Structured data
- **Shell Access** - Direct SQL queries
