---
name: talisman
description: Secret scanner for git repositories
---
# Talisman Plugin

Talisman is a tool that installs a hook to your repository to check the push for potential secrets.

## Commands

- `talisman scan repo` — Scan repository for secrets
- `talisman hook install` — Install pre-push hook
- `talisman _ _` — Passthrough to talisman CLI

## Usage

```bash
# Scan current repo
sc talisman scan repo

# Install pre-push hook
sc talisman hook install

# Passthrough
sc talisman _ _ -- --scan --ignorehistory
```
