---
name: planetscale-cli
description: Use this skill when the user wants to manage PlanetScale MySQL databases, create branches, or submit deploy requests for schema changes.
---

# PlanetScale CLI (pscale)

Branch, deploy, and manage MySQL databases with deploy requests from the terminal.

## Commands

- `planetscale-cli database list` — List databases
- `planetscale-cli branch create` — Create a database branch
- `planetscale-cli deploy request` — Create a deploy request
- `planetscale-cli _ _` — Passthrough to pscale CLI

## Installation

```bash
brew install planetscale/tap/pscale
```

## Authentication

```bash
pscale auth login
```

## Usage Examples

- "List my databases"
- "Create a new branch for my feature"
- "Submit a deploy request for schema change"
- "Connect to a database shell"

## Key Commands

```bash
# List databases
pscale database list --json

# List branches
pscale branch list <database> --json

# Create branch
pscale branch create my-db feature-branch

# Create deploy request
pscale deploy-request create my-db feature-branch

# Deploy
pscale deploy-request deploy my-db <number>

# Connect via shell
pscale shell my-db main
```

## Key Features
- **MySQL** - MySQL database service
- **Branching** - Git-like branching for DBs
- **Deploy Requests** - Schema change workflow
- **JSON Output** - Structured data
- **Shell Access** - Direct DB connection
