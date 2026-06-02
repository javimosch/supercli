---
name: viddy
description: Use this skill when the user wants to watch a command periodically, monitor output changes, or highlight differences between command runs.
---

# viddy Plugin

A modern watch command with diff highlighting, output history, and customizable display.

## Commands

### Watching
- `viddy command watch` — Watch a command with diff highlighting

### Utility
- `viddy _ _` — Passthrough to viddy CLI

## Usage Examples
- "Watch ls -la every 2 seconds"
- "Monitor disk usage with diff highlighting"
- "Watch this command and show changes"
- "Run df -h repeatedly with viddy"

## Installation

```bash
brew install viddy
```

Or via Go:
```bash
go install github.com/sachaos/viddy@latest
```
