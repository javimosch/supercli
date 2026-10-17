---
name: git-delete-merged-branches
description: Use this skill when the user wants to clean up merged git branches locally and remotely.
---

# git-delete-merged-branches Plugin

Delete merged git branches interactively or automatically.

## Commands
- `git-delete-merged-branches <resource> <action>` — Execute git-delete-merged-branches commands
- `git-delete-merged-branches self version` — Print git-delete-merged-branches version
- `git-delete-merged-branches _ _` — Passthrough to git-delete-merged-branches CLI

## Usage Examples

- "delete all merged branches in repo"
- "dry run to see which branches would be deleted"
- "delete merged branches including remote"

## Installation

```bash
npm install -g git-delete-merged-branches
```

## Key Features
- Merged branch detection and deletion
- Dry-run mode for safety
- Local and remote branch cleanup
- Configurable branch patterns
- Interactive confirmation
