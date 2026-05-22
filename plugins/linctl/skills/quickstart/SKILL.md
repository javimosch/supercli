---
name: linctl
description: Use this skill when the user wants to manage Linear issues, projects, teams, and workflows from the command line using the Linear API.
---

# Linctl Plugin

Command-line interface for the Linear API, built with Go and Cobra. Manage issues, projects, teams, users, comments, labels, and execute raw GraphQL queries with comprehensive filtering and multiple output formats.

## Commands

### Authentication
- `linctl auth setup` — Interactive authentication with Linear API key
- `linctl auth status` — Check authentication status
- `linctl user me` — Show current user profile

### Issue Management
- `linctl issue list` — List all issues with optional filtering
- `linctl issue search <query>` — Search issues using Linear's full-text index
- `linctl issue get <id>` — Get detailed information about a specific issue
- `linctl issue create` — Create a new Linear issue
- `linctl issue update <id>` — Update an existing issue

### Project Management
- `linctl project list` — List all projects
- `linctl project get <id>` — Get project details by ID

### Team & User Management
- `linctl team list` — List all teams
- `linctl team members <team>` — List team members
- `linctl user list` — List all users
- `linctl user get <email>` — Get user details by email

### Advanced Features
- `linctl graphql query` — Execute raw GraphQL query against Linear API
- `linctl comment` — Manage issue comments
- `linctl label` — Manage team labels
- `linctl agent` — View delegated/agent session state

## Usage Examples

```bash
# Initial authentication
linctl auth setup
linctl auth status

# List issues with filters
linctl issue list
linctl issue list --assignee me
linctl issue list --state "In Progress"
linctl issue list --team ENG --cycle current

# Search issues
linctl issue search "login bug" --team ENG
linctl issue search "customer:" --include-completed

# Get issue details
linctl issue get LIN-123

# Create issue
linctl issue create --title "Bug fix" --team ENG
linctl issue create --title "Feature" --team ENG --project "Q1 Platform" --labels urgent

# Update issue
linctl issue update LIN-123 --assignee me --priority 1
linctl issue update LIN-123 --state "In Progress" --due-date "2024-12-31"

# Time-based filtering
linctl issue list --newer-than 2_weeks_ago
linctl issue list --newer-than all_time

# Project management
linctl project list --state started
linctl project get 65a77a62-ec5e-491e-b1d9-84aebee01b33

# Team management
linctl team list
linctl team members ENG

# Raw GraphQL query
linctl graphql 'query { viewer { id name email } }'

# JSON output for agents
linctl issue list --json
linctl issue search "api" --json
```

## Installation

```bash
brew tap dorkitude/linctl
brew install linctl
```

Or from source:
```bash
git clone https://github.com/dorkitude/linctl.git
cd linctl
make deps
make build
make install
```

## Important Notes

- **Default filters**: By default, issue list/search shows items from last 6 months and excludes completed items
- **Time filters**: Use `--newer-than 1_month_ago`, `--newer-than all_time` for historical data
- **JSON output**: Agents should use `--json` flag on all read operations
- **Authentication**: Requires Linear API key (personal API key auth)
- **Output modes**: Supports table, plaintext, and JSON formats

## Key Features

- **Comprehensive issue management**: list, search, get, create, update, assign
- **Project lifecycle**: create, update, archive, delete projects with milestones
- **Team workflow**: manage teams, states, members, and workflow configurations
- **Rich filtering**: by assignee, state, team, cycle, project, time ranges
- **Issue relations**: blocks, blocked-by, related, duplicate, similar
- **Agent integration**: inspect agent session state and delegate issues
- **Raw GraphQL**: execute arbitrary Linear GraphQL as escape hatch
- **Dynamic MCP**: schema-driven tool discovery and execution
- **Multiple output formats**: table, plaintext, JSON for different use cases

## Common Workflows

### Daily issue management
```bash
linctl issue list --assignee me --state "In Progress"
linctl issue search "urgent" --team ENG
```

### Project oversight
```bash
linctl project list --state started
linctl issue list --project "Q1 Platform"
```

### Team coordination
```bash
linctl team members ENG
linctl team state list ENG
```

### Agent collaboration
```bash
linctl agent ENG-80
linctl agent mention ENG-80 "Please investigate this failure"
```