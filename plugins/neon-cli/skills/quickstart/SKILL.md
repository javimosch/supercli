---
name: neon-cli
description: Use this skill when the user wants to manage Neon serverless Postgres databases, create branches, or get connection strings.
---

# Neon CLI

Manage Neon projects, branches, databases, roles, and connection strings for serverless Postgres.

## Commands

- `neon-cli project list` — List Neon projects
- `neon-cli branch create` — Create a database branch
- `neon-cli connection string` — Get database connection string
- `neon-cli _ _` — Passthrough to neonctl CLI

## Installation

```bash
npm i -g neonctl
```

## Authentication

```bash
neonctl auth
# or set NEON_API_KEY
```

## Usage Examples

- "List my Neon projects"
- "Create a new branch for feature testing"
- "Get a connection string for my database"
- "List databases in a project"

## Key Commands

```bash
# List projects
neonctl projects list --output json

# Create branch
neonctl branches create --project-id <id> --name feature-branch

# Get connection string
neonctl connection-string --project-id <id>

# List databases
neonctl databases list --branch <branch-id>
```

## Key Features
- **Serverless Postgres** - Managed database service
- **Branching** - Instant database branches
- **JSON Output** - Structured data
- **Connection Strings** - Quick DB access
