---
name: branchlet
description: Use this skill when the user wants to manage git worktrees for parallel development.
---

# Branchlet Plugin

Simple CLI git worktree manager, written in TypeScript.

## Commands

### Worktrees
- `branchlet worktree add` — Add a new git worktree
- `branchlet worktree list` — List git worktrees
- `branchlet worktree remove` — Remove a git worktree
- `branchlet worktree prune` — Prune stale worktrees

## Usage Examples

```bash
branchlet worktree add feature-x
branchlet worktree list
branchlet worktree remove feature-x
branchlet worktree prune
branchlet --help
```

## Installation

```bash
npm install -g branchlet
```

## Key Features
- Simple git worktree management
- Create, list, remove, and prune worktrees
- Parallel branch development
- Clean worktree lifecycle management
