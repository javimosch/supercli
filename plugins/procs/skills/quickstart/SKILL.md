---
name: procs
description: Use this skill when the user wants to view processes, monitor system processes, or list running applications.
---

# procs Plugin

A modern replacement for ps written in Rust. View and manage processes with advanced filtering, sorting, and visualization capabilities.

## Commands

### Process Viewing
- `procs process list` — List and filter processes

### Utility
- `procs _ _` — Passthrough to procs CLI

## Usage Examples
- "List all processes"
- "View running processes"
- "Monitor system processes"
- "Show process tree"

## Installation

```bash
brew install procs
```

Or via Cargo:
```bash
cargo install procs
```

## Examples

```bash
# List all processes
procs process list

# Sort by CPU usage
procs process list --sort cpu

# Sort by memory
procs process list --sort mem

# Tree view
procs process list --tree

# Watch mode (refresh every second)
procs process list --watch

# Add custom column
procs process list --insert user

# Hide header
procs process list --no-header

# Color output
procs process list --color always

# Any procs command with passthrough
procs _ _ --tree --sort cpu
procs _ _ --watch --sort mem
```

## Key Features
- **Modern ps** - Better than traditional ps
- **Tree view** - Show process hierarchy
- **Watch mode** - Auto-refresh process list
- **Sorting** - Sort by any column
- **Custom columns** - Add/remove columns
- **Color output** - Highlight important info
- **Fast** - Written in Rust for speed
- **Cross-platform** - Linux, macOS, Windows
- **Filtering** - Search and filter processes
- **Docker aware** - Show container names

## Notes
- Default shows all processes
- Press Ctrl+C to exit watch mode
- Can filter by name or PID
- Shows CPU, memory, and other stats
- Great for system monitoring
