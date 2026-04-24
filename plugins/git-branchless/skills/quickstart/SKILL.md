---
name: git-branchless
description: Use this skill when the user wants to use branchless Git workflow, manage Git commits efficiently, or use advanced Git features.
---

# git-branchless Plugin

High-velocity, monorepo-scale workflow for Git. Branchless workflow for Git with advanced features for managing commits and branches.

## Commands

### Git Workflow
- `git-branchless git smartlog` — Show smartlog of commits

### Utility
- `git-branchless _ _` — Passthrough to git-branchless CLI

## Usage Examples
- "Show git smartlog"
- "Use branchless git workflow"
- "Manage git commits"
- "Rewrite git history"

## Installation

```bash
brew install git-branchless
```

Or via Cargo:
```bash
cargo install git-branchless
```

## Examples

```bash
# Show smartlog
git-branchless git smartlog

# Any git-branchless command with passthrough
git-branchless _ _ init
git-branchless _ _ smartlog
git-branchless _ _ next
git-branchless _ _ hide
```

## Key Features
- **Branchless** - No need for feature branches
- **Smartlog** - Visual commit graph
- **Commit manipulation** - Move and reorganize commits
- **Monorepo scale** - Works with large codebases
- **Git extension** - Integrates with Git
- **Fast** - High-velocity workflow
- **Undo** - Easy undo of operations
- **Repair** - Repair corrupted repositories
- **Visualize** - Visual commit history
- **Cross-platform** - Linux, macOS, Windows

## Notes
- Works as a Git extension
- Great for monorepos
- Simplifies Git workflow
- Provides commit graph visualization
