---
name: atuin
description: atuin — magical shell history with sync, search, and stats
---
# atuin Plugin

Atuin replaces your shell history with a searchable, encrypted SQLite database, adding context (exit code, duration, directory) and optional end-to-end encrypted sync across machines.

## Quickstart

```bash
# Import existing shell history
atuin import auto

# Interactive fuzzy search of history (also bound to Ctrl-R)
atuin search --interactive

# Search non-interactively for a command
atuin search "git push"

# Show usage stats
atuin stats

# Register and sync history across machines
atuin register -u <username> -e <email>
atuin sync
```
