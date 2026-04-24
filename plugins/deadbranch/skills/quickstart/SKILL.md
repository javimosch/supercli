---
name: deadbranch
description: Use this skill when the user wants to list, delete, or manage stale git branches in a repository. Supports dry-run, backup, restore, and pattern matching for safe branch cleanup.
---

# deadbranch Plugin

Clean up stale git branches safely. List, delete, backup, and restore branches with dry-run support, age filtering, and pattern matching.

## Commands

### Branch Management
- `deadbranch branch list` — List stale branches older than a threshold
- `deadbranch branch clean` — Delete stale branches (with confirmation by default)
- `deadbranch branch stats` — Show branch health overview

### Backup & Restore
- `deadbranch backup create` — Backup branches before deleting
- `deadbranch backup restore` — Restore deleted branches from backup

### Utility
- `deadbranch self version` — Print deadbranch version
- `deadbranch _ _` — Passthrough to deadbranch CLI

## Usage Examples
- "List all stale branches older than 30 days"
- "Show branch health statistics"
- "Delete stale branches (dry-run first)"
- "Clean up branches older than 60 days"
- "Delete only local stale branches"
- "Backup branches before cleanup"
- "Restore deleted branches from backup"

## Installation

```bash
cargo install deadbranch
```

## Examples

```bash
# List stale branches (default: older than 30 days)
deadbranch branch list

# List branches older than 60 days
deadbranch branch list --days 60

# List merged stale branches
deadbranch branch list --merged

# List stale remote branches
deadbranch branch list --remote

# Preview what would be deleted (dry-run)
deadbranch branch clean --dry-run

# Delete stale branches (with confirmation)
deadbranch branch clean

# Delete only local stale branches
deadbranch branch clean --local

# Delete without confirmation
deadbranch branch clean --force

# Backup before deleting
deadbranch branch clean --backup

# Combine options: dry-run local branches older than 45 days
deadbranch branch clean --dry-run --local --days 45

# Show branch health overview
deadbranch branch stats

# Create a backup of branches
deadbranch backup create

# Restore branches from backup
deadbranch backup restore
```

## Key Features

- **Safe deletion** — Confirmation prompts by default (use `--force` to skip)
- **Dry-run mode** — Preview what would be deleted without making changes (`--dry-run`)
- **Age filtering** — Filter branches by minimum age in days (`--days`)
- **Local-only cleanup** — Delete only local branches (`--local`)
- **Remote branch support** — Include remote branches in listing (`--remote`)
- **Merged branch filter** — Only consider merged branches (`--merged`)
- **Pattern matching** — Match branch names with patterns (`--pattern`)
- **Backup & restore** — Backup branches before deletion and restore later
- **Branch statistics** — Overview of branch health and staleness
- **Shell completions** — Bash, Zsh, Fish completions included

## Notes

- Always use `--dry-run` before actual cleanup to preview changes
- The default stale threshold is 30 days
- Backups are created automatically when using `--backup` with `clean`
- Interactive mode is available via `deadbranch --interactive` (run directly, not via supercli)
- The tool works on the current git repository; ensure you are in the correct directory
