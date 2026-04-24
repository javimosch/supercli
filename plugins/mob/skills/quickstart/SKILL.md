---
name: mob
description: Use this skill when the user wants to do mob programming, pair programming with git handover, or switch smoothly between developers working on the same branch.
---

# mob Plugin

Tool for smooth git handover. Fast git branch switching and remote mob programming with WIP commits. Optimized for pair and mob programming.

## Commands

### Session Management
- `mob session start` — Start a mob programming session
- `mob session done` — Finish mob programming session

### Utility
- `mob _ _` — Passthrough to mob CLI

## Usage Examples
- "Start mob programming"
- "Handover to next person"
- "Finish mob session"
- "Pair programming session"

## Installation

```bash
brew install mob
```

Or via Go:
```bash
go install github.com/remotemobprogramming/mob@latest
```

## Examples

```bash
# Start mob session
mob session start

# Start with specific branch
mob session start --branch feature-x --create

# Handover (done by current driver)
mob session done

# Done with commit message
mob session done --message "Implement feature X"

# Any mob command with passthrough
mob _ _ start
mob _ _ next
mob _ _ done
```

## Key Features
- **Handover** - Smooth handover
- **WIP** - WIP commits
- **Fast** - Fast switching
- **Remote** - Remote mob programming
- **Pair** - Pair programming
- **Squash** - Squash on done
- **Branches** - Branch management
- **Timer** - Built-in timer
- **Clean** - Clean history
- **Git** - Git-based workflow

## Notes
- Optimized for mob programming
- Uses WIP commits for handover
- Squashes on session done
- Great for remote teams
