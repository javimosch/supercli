---
name: hyperfine
description: Use this skill when the user wants to benchmark command execution times, compare performance of different commands, or measure program performance with warmup and preparation commands.
---

# hyperfine Plugin

A command-line benchmarking tool. Compare command execution times, run warmup/preparation commands, parameterized benchmarks, and export results to various formats.

## Commands

### Benchmarking
- `hyperfine benchmark run` — Run benchmark on one or more commands

### Utility
- `hyperfine _ _` — Passthrough to hyperfine CLI

## Usage Examples
- "Benchmark this command"
- "Compare the performance of these two commands"
- "Run benchmarks with warmup"
- "Benchmark with parameter scan"

## Installation

```bash
brew install hyperfine
```

Or via Cargo:
```bash
cargo install hyperfine
```

## Examples

```bash
# Basic benchmark
hyperfine benchmark run 'sleep 0.3'

# Compare two commands
hyperfine benchmark run 'hexdump file' 'xxd file'

# Specify number of runs
hyperfine benchmark run --runs 5 'sleep 0.3'

# Warmup runs for disk cache
hyperfine benchmark run --warmup 3 'grep -R TODO *'

# Cold cache with preparation command
hyperfine benchmark run --prepare 'sync; echo 3 | sudo tee /proc/sys/vm/drop_caches' 'grep -R TODO *'

# Parameter scan (numeric)
hyperfine benchmark run --parameter-scan num_threads 1 12 'make -j {num_threads}'

# Parameter scan with step size
hyperfine benchmark run --parameter-scan delay 0.3 0.7 -D 0.2 'sleep {delay}'

# Parameter list (non-numeric)
hyperfine benchmark run -L compiler gcc,clang '{compiler} -O2 main.cpp'

# Use specific shell
hyperfine benchmark run --shell zsh 'for i in {1..10000}; do echo test; done'

# No shell (for very fast commands)
hyperfine benchmark run -N 'grep TODO /home/user'

# Export results
hyperfine benchmark run --export-json results.json 'sleep 0.3'
hyperfine benchmark run --export-csv results.csv 'sleep 0.3'
hyperfine benchmark run --export-markdown results.md 'sleep 0.3'

# Any hyperfine command with passthrough
hyperfine _ _ --runs 10 'sleep 0.1'
```

## Key Features
- **Automatic run detection** — Determines optimal number of benchmarking runs
- **Warmup runs** — Execute warmup runs for disk cache benchmarks
- **Preparation commands** — Run commands before each timing run for cold cache
- **Parameterized benchmarks** — Vary parameters across benchmark runs
- **Shell selection** — Use custom shells or run without shell
- **Export formats** — Export results to JSON, CSV, or Markdown
- **Comparison mode** — Compare multiple commands in a single run
- **Statistical analysis** — Automatic statistical analysis of results

## Notes
- Default: at least 10 runs, measuring for at least 3 seconds
- Shell spawning time is automatically corrected via calibration
- Use -N/--shell=none for very fast commands (< 5ms)
- Can benchmark shell functions and aliases
- Supports all major platforms via package managers
