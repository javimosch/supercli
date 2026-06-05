---
name: op
description: 1Password command-line interface
---
# 1Password CLI Plugin

Manage secrets, credentials and 1Password vaults from the command line.

## Commands

- `op account list` — List all signed-in accounts
- `op item get <id>` — Get a specific item
- `op item list` — List items in a vault
- `op vault list` — List all vaults
- `op _ _` — Passthrough to op CLI

## Usage

```bash
# List accounts
sc op account list

# Get an item
sc op item get --id my-item --vault personal

# List vaults
sc op vault list

# Passthrough
sc op _ _ -- --help
```
