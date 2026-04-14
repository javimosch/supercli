---
name: wtp
description: Use this skill when the user wants to manage Git worktrees, create or remove worktree branches, switch between worktrees, or list existing worktrees.
---

# wtp Plugin

A powerful Git worktree CLI tool with automated setup, branch tracking, and smart navigation.

## Commands

### Worktree Management
- `wtp worktree add` — Add a new Git worktree
- `wtp worktree list` — List all Git worktrees
- `wtp worktree remove` — Remove a Git worktree
- `wtp worktree switch` — Switch between worktrees

### Utility
- `wtp self version` — Print wtp version

## Usage Examples
- "List all worktrees in this repo"
- "Create a new worktree for feature-x"
- "Switch to the feature-x worktree"
- "Remove the old-feature worktree"
- "Add a worktree at a specific path"

## Installation

```bash
brew install satococoa/tap/wtp
```

## Common Examples

```bash
# List all worktrees
wtp list

# Add a new worktree for a branch
wtp add feature-branch

# Add a worktree at a specific path
wtp add feature-branch ../feature-branch

# Remove a worktree
wtp remove feature-branch

# Force remove a worktree with uncommitted changes
wtp remove feature-branch --force

# Switch to a worktree
wtp switch feature-branch

# Check version
wtp --version
```

## Key Features
- Automated worktree setup
- Branch tracking
- Smart navigation between worktrees
- Easy worktree removal
- Git worktree management simplified
