---
name: borgmatic
description: Use this skill when the user wants to automate backups using BorgBackup — configure backups, run prune policies, and monitor backup health.
---

# borgmatic Plugin

borgmatic automates BorgBackup with simple YAML configuration.

## Commands
- `borgmatic <resource> <action>` — Execute borgmatic commands
- `borgmatic self version` — Print borgmatic version
- `borgmatic _ _` — Passthrough to borgmatic CLI

## Usage Examples

- "run a backup with borgmatic"
- "check backup status and integrity"
- "prune old backups to save space"
- "list available backup archives"

## Installation

```bash
pip install borgmatic
```

## Key Features
- YAML-based backup configuration
- BorgBackup wrapper with automation
- Pre/post backup hooks and scripts
- Database dump support (MySQL, PostgreSQL)
- Backup pruning and retention policies
- Compact and integrity checking
- Health check monitoring integration
