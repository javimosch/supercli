---
name: spacer
description: Use this skill when the user wants to insert spacers when command output stops.
---

# Spacer Plugin

CLI tool to insert spacers when command output stops.

## Commands

### Monitoring
- `spacer run insert` — Insert spacer after command output stops

## Usage Examples
- "tail -f some.log | spacer --after 5"
- "my-command |& spacer"

## Installation

```bash
brew install spacer
# or
cargo install spacer
```

## Examples

```bash
# Insert spacer after 1 second of silence (default)
tail -f some.log | spacer

# Insert spacer after 5 seconds of silence
tail -f some.log | spacer --after 5

# Monitor both STDERR and STDOUT
my-command |& spacer
```

## Key Features
- Monitors STDOUT and inserts blank lines when output stops
- Configurable silence duration with --after flag
- Works with pipes and command chains
- Use |& instead of | to monitor both STDERR and STDOUT
