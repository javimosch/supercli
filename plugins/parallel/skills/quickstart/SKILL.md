---
name: parallel
description: Use this skill when the user wants to run commands in parallel, process multiple files simultaneously, or batch-process arguments with GNU parallel.
---

# GNU parallel Plugin

Build and execute shell commands in parallel. Run commands on multiple files, CPUs, or hosts simultaneously.

## Commands

### Version
- `parallel self version` — Print GNU parallel version

### Utility
- `parallel _ _` — Passthrough to GNU parallel CLI

## Usage Examples
- "Run multiple curl requests in parallel"
- "Process all these files with the same command"
- "Resize all images in parallel"
- "Run the same script on multiple inputs"

## Installation

```bash
brew install parallel
```

Or via apt:
```bash
sudo apt-get install parallel
```

## Examples

```bash
# Run commands in parallel from a file
parallel _ _ -a commands.txt

# Process all .txt files
parallel _ _ wc {} ::: *.txt

# Run gzip on all .log files with progress
parallel _ _ --progress gzip {} ::: *.log

# Convert all .png files to .jpg with 4 jobs
parallel _ _ -j4 convert {} {.}.jpg ::: *.png

# Run commands on remote hosts via SSH
parallel _ _ -S host1,host2 command ::: args

# Print version
parallel self version

# Show help
parallel _ _ --help
```

## Key Features
- **Job slots** — Control parallelism with `-j` (e.g., `-j4` for 4 jobs)
- **Input sources** — Files, stdin, command output, or `::: args`
- **Remote execution** — Run on multiple SSH hosts with `-S`
- **Progress display** — `--progress` shows job completion status
- **Result aggregation** — `--results` saves output per job
- **Error handling** — `--halt` on error, fail, or success conditions
- **Job log** — `--joblog` for tracking job status and timing
