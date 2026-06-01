---
name: git-absorb
description: Use this skill when the user wants to auto-create fixup! commits for staged Git changes, clean up a messy commit history before rebasing, or absorb staged diffs into the correct existing commits.
---

# git-absorb Plugin

Auto-create fixup! commits for staged Git changes. Scans your working copy, identifies which existing commits each staged diff belongs to, and writes fixup! commits so you can rebase cleanly.

## Commands

### Absorb
- `git-absorb commit absorb` — Auto-create fixup commits for all staged changes

### Options
- `--base <ref>` — Absorb only against commits reachable from `<ref>` (e.g., `origin/main`)
- `--dry-run` — Show what would be absorbed without making changes
- `--and-rebase` — Auto-absorb and then rebase with `GIT_SEQUENCE_EDITOR=true git rebase -i`
- `--force` — Apply fixups even when conflicts might occur

## Usage Examples
- "Absorb my staged changes into the right commits"
- "Clean up my working copy before rebasing"
- "Fixup all staged changes onto origin/main"
- "Show what would be absorbed without making changes"

## Installation

```bash
cargo install git-absorb
```

## Examples

```bash
# Stage changes, then absorb into existing commits
git add -p
git-absorb

# Dry run to preview
git-absorb --dry-run

# Absorb against a specific base
git-absorb --base origin/main

# Absorb and rebase automatically
git-absorb --and-rebase

# Use as git subcommand (if configured)
git absorb
```

## Key Features
- Zero config — just stage and run
- Smart commit matching via hunk analysis
- Dry-run mode for safety
- Works with any Git repository
- Integrates with standard `git rebase -i` workflow
