---
name: hwatch
description: Use this skill when the user wants to watch a command periodically with history tracking, diff output, or scrollback capabilities.
---

# hwatch Plugin

Modern alternative to watch command with history and diff support.

## Commands

### Watch
- `hwatch watch run` — Watch a command and show output with history
- `hwatch watch diff` — Watch a command and show diff between runs
- `hwatch watch batch` — Run hwatch in batch mode (non-interactive)

## Usage Examples
- "Watch a command and track changes over time"
- "Monitor a file with diff output"
- "Run a command periodically with history"
- "Watch docker ps in batch mode"

## Installation

```bash
cargo install hwatch
```

## Examples

```bash
# Basic watch with 2-second interval
hwatch -n 2 ls -la

# Watch with diff highlighting
hwatch -d kubectl get pods

# Batch mode for 60 seconds
hwatch --batch -n 5 -d date

# Watch with history and scrollback
hwatch -H docker stats

# Multiple commands with shell
hwatch 'ps aux | grep python'
```

## Key Features
- Command history with scrollback
- Diff mode highlights changes
- Batch mode for non-interactive use
- Customizable interval
- Color themes support
- Multiple command support
