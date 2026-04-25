---
name: taskwarrior
description: Use this skill when the user wants to manage tasks from the command line.
---

# Taskwarrior Plugin

Command line task list management utility with projects, tags, priorities, and due dates.

## Commands

### Task Management
- `taskwarrior task add` — Add a new task
- `taskwarrior task list` — List tasks
- `taskwarrior task done` — Mark task as completed
- `taskwarrior task next` — Show next task

## Usage Examples
- "taskwarrior task add --description 'Fix bug' --project dev --priority H"
- "taskwarrior task list --filter project:dev"
- "taskwarrior task done --id 1"
- "taskwarrior task next"

## Installation

```bash
brew install task
# or
apt install taskwarrior
```

## Examples

```bash
# Add a simple task
task add Buy groceries

# Add task with project and priority
task add Fix bug project:dev priority:H

# Add task with due date
task add Submit report due:friday

# List all pending tasks
task list

# List tasks for a project
task list project:work

# List high priority tasks
task list priority:H

# Mark task as done
task done 1

# Show next task
task next

# Add recurring task
task add Pay rent due:1st recur:monthly

# Add task with tags
task add Review code +work +review
```

## Key Features
- Projects for organizing tasks
- Tags for categorization
- Priority levels (H, M, L)
- Due dates and recurring tasks
- Task dependencies
- Search and filtering
- Extensible with hooks and extensions
- Active ecosystem of tools
