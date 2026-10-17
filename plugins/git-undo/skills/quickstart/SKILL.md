---
name: git-undo
description: Use this skill when the user wants to undo git changes — revert commits, unstage files, or discard working directory changes.
---

# git-undo Plugin

git-undo provides smart git undo operations.

## Commands
- `git-undo <resource> <action>` — Execute git-undo commands
- `git-undo self version` — Print git-undo version
- `git-undo _ _` — Passthrough to git-undo CLI

## Usage Examples

- "undo the last commit"
- "unstage all staged files"
- "discard changes in working directory"
- "undo a specific commit by hash"

## Installation

```bash
npm install -g git-undo
```

## Key Features
- Smart undo for all git states
- Commit revert with history
- Unstage and discard operations
- Reflog awareness for safety
- Interactive confirmation prompts
