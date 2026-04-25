---
name: git-xargs
description: Use this skill when the user wants to run Git commands across multiple repositories, perform bulk Git operations, or manage many repos at once.
---

# git-xargs Plugin

Run Git commands across multiple repositories. Execute Git operations across many repos at once from the command line.

## Commands

### Bulk Operations
- `git-xargs repo run` — Run command across multiple repos

### Utility
- `git-xargs _ _` — Passthrough to git-xargs CLI

## Usage Examples
- "Run Git command across repos"
- "Bulk update repositories"
- "Execute command in multiple repos"
- "Git automation across repos"

## Installation

```bash
brew install git-xargs
```

Or via Go:
```bash
go install github.com/gruntwork-io/git-xargs/cmd/git-xargs@latest
```

## Examples

```bash
# Run command across repos
git-xargs --args "git status" --repos repos.txt

# Create branches across repos
git-xargs --args "git checkout -b feature" --branch-name feature

# Commit changes across repos
git-xargs --args "git add ." --commit-message "Update deps"

# Any git-xargs command with passthrough
git-xargs _ _ --args "git pull"
git-xargs _ _ --branch-name hotfix
git-xargs _ _ --commit-message "Fix bug"
```

## Key Features
- **Bulk** - Bulk operations
- **Multi-repo** - Multi-repo support
- **Git** - Git operations
- **Automation** - Automation
- **Branches** - Branch management
- **Commits** - Commit management
- **CLI** - Command line native
- **Parallel** - Parallel execution
- **Efficient** - Efficient processing
- **Dev** - Developer tools

## Notes
- Great for monorepo management
- Supports parallel execution
- Can create branches and commits
- Perfect for bulk updates
