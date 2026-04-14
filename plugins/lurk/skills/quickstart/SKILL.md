---
name: lurk
description: Use this skill when the user wants to trace system calls of a process, debug application behavior, or needs a prettier alternative to strace.
---

# lurk Plugin

A pretty alternative to strace for tracing system calls.

## Commands

### Trace
- `lurk trace run` — Trace system calls of a command
- `lurk trace attach` — Attach to a running process (requires sudo)

### Summary
- `lurk summary run` — Show summary of system calls

## Usage Examples
- "Trace a command's system calls"
- "Attach to a running process"
- "Show syscall summary"
- "Filter by syscall type"

## Installation

```bash
cargo install lurk-cli
# or
pacman -S lurk
```

## Examples

```bash
# Trace a command
lurk ls

# Attach to process (requires sudo)
sudo lurk --attach 1234

# Summary output
lurk --summary ls

# JSON output
lurk --json curl http://example.com

# Filter by file operations
lurk --expr trace=%file curl http://example.com

# Successful syscalls only
lurk --successful-only curl http://example.com
```

## Common Flags
- `--attach PID` — Attach to running process
- `--summary` — Show summary report
- `--json` — JSON output
- `--expr trace=syscall` — Filter by syscall
- `--follow-forks` — Trace child processes
- `--syscall-times` — Show time spent in syscalls