---
name: dstask
description: Use this skill when the user wants to manage personal tasks from the command line, add tasks with tags, or organize todos with git-backed storage.
---

# dstask Plugin

A personal command-line todo manager. Manage tasks with tags, contexts, and priorities from the command line with git-backed storage.

## Commands

### Task Management
- `dstask task add` — Add a new task
- `dstask task list` — List tasks
- `dstask task complete` — Complete a task

### Utility
- `dstask _ _` — Passthrough to dstask CLI

## Usage Examples
- "Add a task to dstask"
- "List my tasks"
- "Complete a task"
- "Manage todos with git"

## Installation

```bash
brew install dstask
```

Or via Go:
```bash
go install github.com/naggie/dstask/cmd/dstask@latest
```

## Examples

```bash
# Add a task
dstask add "Fix the bug"

# Add with tag and priority
dstask add "Deploy to production" +work P1

# List all tasks
dstask show

# List by tag
dstask show +work

# List by project
dstask show project:myproject

# Complete a task
dstask done 123

# Any dstask command with passthrough
dstask _ _ add "New task"
dstask _ _ show +urgent
dstask _ _ done 456
```

## Key Features
- **Tasks** - Add, list, complete
- **Tags** - Task tags
- **Contexts** - Context support
- **Priorities** - Priority levels
- **Projects** - Project organization
- **Git** - Git-backed storage
- **Sync** - Git sync
- **Filter** - Powerful filtering
- **CLI** - Command line native
- **Productivity** - Task management

## Notes
- Git-backed storage
- Supports tags and contexts
- Great for personal task management
- Sync across devices via git
