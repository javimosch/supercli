---
name: jj
description: Use this skill when the user wants to use a modern Git-compatible VCS, view commit history, create branches, manage changes, or collaborate with Git repos using jj (Jujutsu).
---

# Jujutsu (jj) Plugin

A Git-compatible VCS that is both simple and powerful. Works with existing Git repos natively, offering undo, auto-squash, conflict resolution, and more.

## Commands

### Self
- `jj self version` — Print version

### Log
- `jj log show` — Show commit log with revision graph

### Status
- `jj status show` — Show working copy status

### Changes
- `jj new create` — Create a new empty change
- `jj describe edit` — Edit the description of a change
- `jj commit create` — Finalize current change with a description

### Diff
- `jj diff show` — Show diff of a change

### Git Integration
- `jj git push` — Push changes to a remote Git repository
- `jj git fetch` — Fetch from a Git remote

### Workspace
- `jj workspace list` — List workspaces

### Passthrough
- `jj _ _` — Passthrough for any jj command

## Usage Examples
- "Show me the commit log in this repo"
- "What's my current working copy status?"
- "Create a new change and describe it"
- "Show the diff of my current changes"
- "Push this change to the remote"
- "Fetch latest changes from the remote"

## Installation

```bash
cargo install jj-cli
```

## Examples

```bash
# Initialize jj in a Git repo
jj git init

# Show log
jj log

# Check status
jj status

# Create new change
jj new -m "my feature"

# Edit description
jj describe -m "Updated: my awesome feature"

# Show diff
jj diff

# Commit
jj commit -m "feat: implement awesome feature"

# Sync with Git remote
jj git fetch
jj git push

# Show changes since main
jj diff --from main
```

## Key Features
- Git-compatible: works with existing Git repos
- Undo everything: mistakes are easily reversible
- Auto-squashing: related changes are automatically squashed
- Conflict resolution: simpler conflict handling
- Working-copy-as-a-change: the working copy is a change like any other
- Multiple workspaces: work on multiple branches simultaneously
- Built-in log graph and diff tools
- No staging area: simpler mental model
