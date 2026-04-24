---
name: autorestic
description: Use this skill when the user wants to configure and run restic backups, manage backup locations, or automate backup tasks with YAML configuration.
---

# autorestic Plugin

Config wrapper for restic backup. Configure, run, and forget backup tasks with a simple YAML configuration file.

## Commands

### Backup Operations
- `autorestic backup run` — Run configured backups
- `autorestic backup check` — Check backup status and integrity

### Utility
- `autorestic _ _` — Passthrough to autorestic CLI

## Usage Examples
- "Run backups"
- "Check backup status"
- "Configure restic backup"
- "Automate backups"

## Installation

```bash
brew install autorestic
```

Requires restic to be installed separately.

## Examples

```bash
# Run all configured backups
autorestic backup run

# Backup specific location
autorestic backup run --location my-documents

# Dry run
autorestic backup run --dry-run

# Check backups
autorestic backup check

# Any autorestic command with passthrough
autorestic _ _ backup
autorestic _ _ check
autorestic _ _ restore
```

## Key Features
- **YAML config** - Simple configuration
- **Multiple** - Multiple locations
- **Backends** - Multiple backends
- **Cron** - Cron integration
- **Hooks** - Pre/post hooks
- **Check** - Integrity checking
- **Forget** - Automatic pruning
- **Restore** - Easy restore
- **Restic** - Restic wrapper
- **Automation** - Backup automation

## Notes
- Requires restic installed
- Configure via .autorestic.yaml
- Supports multiple locations
- Great for automated backups
