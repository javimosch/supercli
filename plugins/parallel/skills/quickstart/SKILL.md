---
name: parallel
description: Use this skill when the user wants to run commands in parallel, batch process files, distribute work across CPU cores, or use GNU parallel.
---

# GNU Parallel Plugin

Build and execute shell commands in parallel across multiple CPU cores or multiple machines.

## Commands

### Execution
- `parallel _ _` — Execute commands in parallel using GNU parallel

## Usage Examples
- "Run commands in parallel"
- "Process files in parallel"
- "Parallelize this shell command"
- "Run multiple jobs at once"

## Installation

```bash
brew install parallel
```

Or via package manager:
```bash
apt-get install parallel   # Debian/Ubuntu
dnf install parallel       # Fedora
```

## Examples

```bash
# Basic: run commands in parallel
parallel _ _ echo ::: A B C D

# Process files in parallel (4 jobs at a time)
parallel _ _ --jobs 4 gzip ::: *.log

# With progress indicator
parallel _ _ --progress wc -l ::: *.txt

# Remote execution
parallel _ _ --sshlogin server1,server2 uptime ::: host1 host2

# Pipe mode: process stdin in parallel
cat urls.txt | parallel _ _ --pipe curl -s

# Dry run to preview
parallel _ _ --dry-run convert {} {.}.png ::: *.jpg
```

## Key Features
- **Parallel execution** - Run commands in parallel
- **Job slots** - Control concurrency with `--jobs`
- **Progress** - Show progress with `--progress`
- **Remote** - Distribute to remote machines via `--sshlogin`
- **Pipe mode** - Process stdin in parallel
- **Xargs style** - Pass arguments like xargs
- **Keep order** - Preserve output order
- **Dry run** - Preview commands
- **Timeout** - Per-job timeout
- **Retries** - Retry failed jobs

## Notes
- GNU parallel is very powerful with many options
- Use `--dry-run` to preview before executing
- The `:::` separator introduces arguments
- Use `{}` for the argument placeholder
- Use `{.}` for the argument without extension
- Use `{/}` for the basename
- Use `{//}` for the dirname
