---
name: worktrunk
description: Use this skill when the user wants to manage Git worktrees, switch between parallel branches, or work with multiple worktrees.
---

# worktrunk Plugin

CLI for Git worktree management, designed for parallel AI agent workflows.

## Commands

### Branch
- `worktrunk branch switch` — Switch to a worktree branch
- `worktrunk branch create` — Create and switch to a new worktree branch
- `worktrunk branch list` — List all worktree branches
- `worktrunk branch remove` — Remove a worktree branch

## Usage Examples
- "Switch to a different worktree branch"
- "Create a new worktree for a feature branch"
- "List all my worktrees"
- "Remove a worktree I no longer need"

## Installation

```bash
cargo install worktrunk
wt config shell install
```

## Examples

```bash
# Switch to existing branch
wt switch feature-branch

# Create and switch to new branch
wt switch -c new-feature

# Create with external tool execution
wt switch -c -x claude new-feature

# List all worktrees
wt list

# Remove current worktree
wt remove

# Remove specific worktree
wt remove old-branch

# Checkout PR
wt switch pr:123
```

## Key Features
- Branch-name based worktree addressing
- Automatic path computation
- Hooks for workflow automation
- LLM commit message generation
- PR checkout support
- Build cache sharing between worktrees
