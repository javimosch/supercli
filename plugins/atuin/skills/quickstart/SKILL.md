---
name: atuin
description: Use this skill when the user wants better shell history — full-text search, sync across machines, or usage stats — replacing the default history with a searchable database.
---

# atuin Plugin

Magical shell history: stores your command history in a searchable SQLite database
with optional end-to-end encrypted sync across machines.

## Commands

### Self
- `atuin self version` — Print atuin version

### Passthrough
- `atuin _ _` — Run any atuin command (search, import, sync, stats, ...)

## Usage Examples
- "Search my shell history for the last docker command"
- "Import my existing bash/zsh history into atuin"
- "Show stats about my most-used commands"

## Notes
After install, run `atuin import auto` then add the shell init to your rc file.
Install with `cargo install atuin` (also available via brew, pacman, nix, or the official script).
