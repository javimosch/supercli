---
name: dar
description: Use this skill when the user wants full-featured disk backups or archives — incremental snapshots, encryption, compression, or tar-like archiving with more control.
---

# dar Plugin

Disk ARchive (dar) — a powerful backup and archiving tool. Supports incremental backups, slices, compression, encryption, and selective restore — a feature-rich alternative to tar for serious backup workflows.

## Installation

```bash
apt install dar
# or
brew install dar
```

## Basic Usage

```bash
# Create a full backup archive of /home
dar -c backup-$(date +%F).dar /home

# List archive contents
dar -l backup-2026-07-20.dar

# Restore files from archive
dar -x backup-2026-07-20.dar -R /
```

## Common Patterns

```bash
# Incremental backup (reference previous archive)
dar -c backup-inc.dar -A backup-full.dar /home

# Split archive into 500MB slices
dar -c backup.dar -s 500M /home

# Exclude paths
dar -c backup.dar -X '*/node_modules/*' /home
```

## Usage Examples

- "Back up /home with incremental dar archives"
- "List contents of a .dar backup file"
- "Create an encrypted disk archive with dar"

## SuperCLI

```bash
sc dar _ _ -c mybackup.dar /data
sc dar _ _ -l mybackup.dar
sc plugins learn dar
```
