---
name: taskwarrior-tui
description: Use this skill when the user wants a terminal UI for Taskwarrior — browse, filter, and manage tasks with vi keybindings instead of typing raw task commands.
---

# taskwarrior-tui Plugin

Interactive TUI front-end for [Taskwarrior](https://taskwarrior.org/). View pending tasks, apply filters, and navigate your backlog with keyboard-driven workflows.

## Installation

```bash
# Taskwarrior is required first
brew install task
# or: apt install taskwarrior

# Install the TUI
cargo install taskwarrior-tui
```

## Basic Usage

```bash
# Launch the interactive task list
taskwarrior-tui

# Open with a saved filter/report
taskwarrior-tui --report next

# Specify config location
taskwarrior-tui --taskdata ~/.task
```

## Key Bindings

- `j/k` or `↓/↑` — Move selection
- `/` — Filter tasks
- `Enter` — View task details
- `m` — Modify selected task
- `a` — Add a new task
- `d` — Mark done
- `q` — Quit

## Common Patterns

```bash
# Add tasks from the shell, browse in TUI
task add Fix login bug +urgent project:web
taskwarrior-tui

# Filter urgent items inside the TUI
# Press / then type: +urgent

# Sync with Taskserver (if configured)
task sync
taskwarrior-tui
```

## Usage Examples

- "Show my Taskwarrior backlog in a terminal UI"
- "Filter tasks tagged urgent interactively"
- "Mark today's tasks done without memorizing task syntax"

## SuperCLI

```bash
sc taskwarrior-tui _ _
sc taskwarrior-tui _ _ --report next
sc plugins learn taskwarrior-tui
```
