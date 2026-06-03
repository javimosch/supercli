---
name: wren
description: Use this skill when the user wants to manage tasks and to-do lists with an advanced task management system using wren.
---

# wren Plugin

Advanced task management system — organize, prioritize, and track tasks from the command line.

## Commands

- `wren task run <args>` -- Run advanced task management

## Usage Examples

List all tasks:
```
wren task run list
```

Add a new task:
```
wren task run add "Complete project documentation"
```

Mark task as done:
```
wren task run done <task_id>
```

Show task details:
```
wren task run show <task_id>
```

## Installation

```
pip install wren-cli
```

## Key Features

- Task creation and management
- Priority levels and categories
- Due date tracking
- Filter and search tasks
- Markdown export
