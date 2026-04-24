---
name: hishtory
description: Use this skill when the user wants to search shell history, sync history across devices, or get contextual information about past commands.
---

# hishtory Plugin

Your shell history in context. Search, sync, and get rich context for your shell history across all your devices.

## Commands

### History Search
- `hishtory history search` — Search shell history

### Utility
- `hishtory _ _` — Passthrough to hishtory CLI

## Usage Examples
- "Search command history"
- "Find past commands"
- "Shell history sync"
- "Search history with context"

## Installation

```bash
brew install hishtory
```

## Examples

```bash
# Search history
hishtory history search "docker"

# Limit results
hishtory history search "deploy" --limit 10

# Search all history
hishtory history search "error" --all

# Any hishtory command with passthrough
hishtory _ _ query "git"
histtory _ _ status
histtory _ _ sync
```

## Key Features
- **Context** - Rich command context
- **Search** - Full-text search
- **Sync** - Cross-device sync
- **Directory** - Working directory tracking
- **Git** - Git context awareness
- **Duration** - Command duration tracking
- **Exit** - Exit code tracking
- **Bash** - Bash support
- **Zsh** - Zsh support
- **Fish** - Fish support

## Notes
- Records command context
- Syncs across devices
- Supports multiple shells
- Great for finding commands
