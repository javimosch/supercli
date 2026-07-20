---
name: xata
description: Use this skill when the user wants to manage Xata serverless Postgres — branches, migrations, schema changes, or data operations from the terminal.
---

# xata Plugin

CLI for [Xata](https://xata.io) serverless Postgres. Manage database branches, run migrations, inspect schema, and operate on data without opening the web UI.

## Installation

```bash
npm install -g @xata.io/cli
xata --version
```

## Basic Usage

```bash
# Log in to your Xata account
xata auth login

# List databases in the current workspace
xata dbs list

# Create a development branch from main
xata branch create dev --from main
```

## Common Patterns

```bash
# Pull schema to local migration files
xata schema pull

# Apply pending migrations
xata migrate apply

# Open the web console for the active branch
xata browse
```

## Usage Examples

- "Create a dev branch of my Xata database"
- "Apply Xata migrations from the CLI"
- "List databases in my Xata workspace"

## SuperCLI

```bash
sc xata _ _ auth login
sc xata _ _ dbs list
sc plugins learn xata
```
