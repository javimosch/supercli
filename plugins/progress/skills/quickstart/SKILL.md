---
name: progress
description: Use this skill when the user wants to check progress of running cp, mv, dd commands, monitor file transfers, or see how long a file operation will take.
---

# Progress Plugin

Display progress of running coreutils commands (cp, mv, dd, tar, cat, etc.).

## Commands

### Monitoring
- `progress monitor show` — Show progress of running coreutils commands
- `progress _ _` — Passthrough to progress CLI

## Usage Examples
- "Check progress of file copy"
- "Monitor running cp commands"
- "How long until my file transfer finishes?"
- "Show progress of mv operations"

## Installation

```bash
brew install progress
```

Or via package manager:
```bash
apt-get install progress   # Debian/Ubuntu
dnf install progress       # Fedora
```

Or via Cargo:
```bash
cargo install progress
```

## Examples

```bash
# Show progress of all running coreutils commands
progress monitor show

# Continuous monitoring (like top)
progress monitor show --monitor

# Wait for processes to start then monitor
progress monitor show --wait

# Quiet mode - only show when done
progress monitor show --quiet

# Any progress CLI command
progress _ _ --monitor
progress _ _ --wait --quiet
```

## Key Features
- **Real-time** - Shows live progress of running commands
- **Multiple tools** - Works with cp, mv, dd, tar, cat, rsync, grep, cut, sort, and more
- **Continuous** - Monitor mode shows updates like top
- **Wait mode** - Wait for new processes to appear
- **Quiet** - Suppress output until completion
- **Minimal** - Lightweight C tool, no dependencies

## Notes
- Shows % progress and estimated time remaining
- Works on Linux, macOS, and other Unix-like systems
- Requires /proc on Linux
- Previously known as 'cv' (coreutils viewer)
