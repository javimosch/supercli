---
name: todoist
description: Use this skill when the user wants to manage Todoist tasks from the command line, add tasks, list tasks, or organize productivity from the terminal.
---

# todoist Plugin

Todoist CLI client. Manage tasks, projects, and productivity directly from the command line. Add, list, complete, and organize tasks.

## Commands

### Task Management
- `todoist task add` — Add a new task to Todoist
- `todoist task list` — List tasks from Todoist

### Utility
- `todoist _ _` — Passthrough to todoist CLI

## Usage Examples
- "Add a task to Todoist"
- "List my tasks"
- "Show Todoist tasks"
- "Manage tasks from CLI"

## Installation

```bash
brew install todoist
```

Requires Todoist API token configured.

## Examples

```bash
# Add a task
todoist task add "Review pull request"

# Add with project and priority
todoist task add "Deploy to production" --project work --priority 1 --due tomorrow

# List all tasks
todoist task list

# List by project
todoist task list --project work

# Filter tasks
todoist task list --filter "today"

# Any todoist command with passthrough
todoist _ _ add "New task"
todoist _ _ list
todoist _ _ done 1234567890
```

## Key Features
- **Tasks** - Add, list, complete
- **Projects** - Project management
- **Priorities** - Priority levels
- **Due dates** - Date support
- **Filters** - Powerful filtering
- **CLI** - Command line native
- **Sync** - Sync with Todoist
- **Productivity** - Boost productivity
- **Workflow** - CLI workflows
- **Organize** - Stay organized

## Notes
- Requires Todoist API token
- Great for CLI-based productivity
- Syncs with Todoist app
- Supports all Todoist features
