---
name: dolt
description: Use this skill when the user wants a SQL database with Git-style version control — branch tables, diff schemas, merge data changes, or clone/fork datasets like a Git repository.
---

# dolt Plugin

Git for data — a MySQL-compatible SQL database you can fork, clone, branch, merge, push, and pull. Version-control tabular data with familiar Git workflows.

## Installation

```bash
curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash
# or
brew install dolt
```

## Basic Usage

```bash
# Initialize a new database repo
dolt init

# Start a SQL shell (MySQL-compatible)
dolt sql

# Run a query
dolt sql -q "SELECT * FROM my_table"

# Version control operations
dolt status
dolt add .
dolt commit -m "Add initial data"
dolt branch feature
dolt checkout feature
dolt diff
dolt merge main
```

## Remote Workflows

```bash
# Clone from DoltHub
dolt clone dolthub/my-org/my-database

# Push and pull
dolt remote add origin dolthub/my-org/my-database
dolt push origin main
dolt pull origin main
```

## Usage Examples

- "Create a versioned SQL database for this dataset"
- "Show me the diff between branches"
- "Query this table and commit the changes"
- "Clone a Dolt database from DoltHub"

## SuperCLI

```bash
sc dolt _ _ sql -q "SHOW TABLES"
sc plugins learn dolt
```
