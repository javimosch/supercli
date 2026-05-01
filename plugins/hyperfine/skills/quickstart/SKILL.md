---
name: hyperfine
description: Use this skill when the user wants to benchmark command execution times, compare performance of different commands, measure script performance, or analyze CLI tool speed.
---

# hyperfine Plugin

Command-line benchmarking tool to measure and compare command execution times with statistical analysis.

## Commands

### Benchmark
- `hyperfine benchmark run` — Benchmark a single command
- `hyperfine benchmark compare` — Compare multiple commands

## Usage Examples
- "Benchmark this command"
- "Compare the speed of these two commands"
- "Measure execution time of this script"
- "Which command is faster: A or B?"

## Installation

```bash
cargo install hyperfine
# or
brew install hyperfine
# or
apt install hyperfine
```

## Examples

```bash
# Basic benchmark
hyperfine "sleep 0.5"

# Compare commands
hyperfine "sleep 0.5" "sleep 1"

# Warmup runs
hyperfine --warmup 3 "sleep 0.5"

# Multiple runs
hyperfine --runs 10 "sleep 0.5"

# Export results
hyperfine --export-json results.json "sleep 0.5"

# Compare with parameter
hyperfine --prepare 'make build' './program arg1'
```

## Common Flags
- `--warmup N` — Number of warmup runs
- `--runs N` — Number of benchmark runs
- `--min-runs N` — Minimum number of runs
- `--export-json FILE` — Export results as JSON
- `--export-markdown FILE` — Export results as Markdown
- `--export-csv FILE` — Export results as CSV
- `--prepare CMD` — Command to run before each benchmark
- `--cleanup CMD` — Command to run after each benchmark
- `-s` — Shell to use
- `-n NAME` — Name for the command
