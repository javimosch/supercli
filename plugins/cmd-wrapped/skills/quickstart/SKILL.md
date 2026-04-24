---
name: cmd-wrapped
description: Use this skill when the user wants to analyze shell command history, generate terminal usage statistics, or get insights from command line activity.
---

# cmd-wrapped Plugin

A command line history stats analyzer. Generate beautiful statistics and insights from your shell command history.

## Commands

### History Analysis
- `cmd-wrapped history analyze` — Analyze shell command history

### Utility
- `cmd-wrapped _ _` — Passthrough to cmd-wrapped CLI

## Usage Examples
- "Analyze command history"
- "Shell usage statistics"
- "Terminal history stats"
- "Command line insights"

## Installation

```bash
brew install cmd-wrapped
```

Or via Cargo:
```bash
cargo install cmd-wrapped
```

## Examples

```bash
# Analyze current shell history
cmd-wrapped history analyze

# Analyze specific shell
cmd-wrapped history analyze --shell zsh

# Analyze specific year
cmd-wrapped history analyze --year 2024

# Any cmd-wrapped command with passthrough
cmd-wrapped _ _ --shell bash
cmd-wrapped _ _ --shell fish --year 2023
```

## Key Features
- **Statistics** - Command frequency
- **Insights** - Usage patterns
- **Shells** - Multi-shell support
- **Bash** - Bash history
- **Zsh** - Zsh history
- **Fish** - Fish history
- **Nushell** - Nushell history
- **Years** - Year filtering
- **Beautiful** - Pretty output
- **Terminal** - Terminal stats

## Notes
- Supports bash, zsh, fish, nushell
- Auto-detects shell history
- Great for year-in-review
- Shows command patterns
