---
name: git-absorb
description: Use this skill when the user wants to auto-absorb staged changes into relevant previous commits, apply code review feedback efficiently, or avoid manual fixup commit creation.
---

# git-absorb Plugin

Automatically fold staged changes into the appropriate previous commits. Eliminates manual fixup commit creation during code review feedback cycles.

## Commands

### Version
- `git-absorb self version` — Print git-absorb version

### Absorb
- `git-absorb repo absorb` — Run git-absorb on current repo
- `git-absorb repo absorb --and-rebase` — Absorb and auto-rebase
- `git-absorb repo absorb --base master` — Use master as base ref
- `git-absorb repo absorb --force` — Write fixup commits even if conflicts detected

### Utility
- `git-absorb _ _` — Passthrough to git-absorb CLI

## Usage Examples
- "Absorb my staged changes into the right commits"
- "Apply review feedback with git-absorb"
- "Run git absorb with --and-rebase"

## Installation

```bash
cargo install git-absorb
```

Or via Homebrew:
```bash
brew install git-absorb
```

## Examples

```bash
# Stage changes and absorb into relevant previous commits
git-absorb repo absorb

# Absorb and auto-rebase in one step
git-absorb repo absorb --and-rebase

# Specify a base ref
git-absorb repo absorb --base master

# Force absorption even if conflicts are detected
git-absorb repo absorb --force
```

## Key Features
- **Automatic** — Finds the right commit for each staged hunk automatically
- **Smart** — Uses commutation checking to determine which changes belong where
- **Safe** — Creates fixup commits you can inspect before rebasing
- **Review-friendly** — Speed up code review feedback application
- **Git-native** — Works as a git subcommand (git absorb)

## Notes
- Only staged changes (git index) are considered
- Use `git rebase -i --autosquash` after `git absorb` to apply fixups (unless using `--and-rebase`)
- Default stack size is 10 commits; override with `--base` or config
- Works with any git workflow where you have a stack of draft commits
