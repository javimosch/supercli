---
name: firm
description: Use this skill when the user wants to manage business entities, projects, tasks, or organizations as structured data with a graph-based work management system.
---

# firm Plugin

Business-as-code work management system for technologists. Model organizations, projects, and tasks as a graph and query them with a declarative DSL.

## Commands

### Workspace
- `firm workspace init` — Initialize a firm workspace in the current directory

### Entities
- `firm entity add` — Add an entity to the workspace
- `firm entity list` — List entities of a given type

### Queries
- `firm data query` — Query workspace data using the firm DSL

### Utility
- `firm self version` — Print firm version
- `firm _ _` — Passthrough to firm CLI

## Usage Examples
- "Initialize a firm workspace"
- "Add a new organization to the workspace"
- "List all projects in the workspace"
- "Query all tasks assigned to me"
- "Find organizations matching a name"

## Installation

```bash
brew tap 42futures/firm && brew install firm
```

## Examples

```bash
# Initialize workspace
cd my_workspace
firm workspace init

# Add an organization
firm entity add --type organization --id megacorp --field name "Megacorp Ltd."

# Add a project
firm entity add --type project --id website --field name "Company Website" --field status "active"

# List all organizations
firm entity list organization

# List all projects
firm entity list project

# Query with DSL
firm data query 'from organization | where name contains "Megacorp"'

# Complex query
firm data query 'from project | where status == "active" | sort by created desc'
```

## Key Features
- Graph-based entity modeling
- Declarative query DSL with filters, sorting, and projections
- Track organizations, projects, tasks, and custom entity types
- Version-controlled workspace data
- Extensible field system
- Business-as-code approach to work management

## Notes
- Run `firm workspace init` before adding entities
- All entity and query commands run in the current workspace directory
- The query DSL supports `from`, `where`, `sort by`, and pipe operators
