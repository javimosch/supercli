---
name: prism
description: Use this skill when the user wants to beautify Go test output, colorize unit test results, or parse test failures more easily.
---

# prism Plugin

Make unit test output beautiful — colorized, formatted Go test results.

## Commands

### Test
- `prism test run` — Run tests with prism

### Benchmark
- `prism bench` — Run benchmarks

## Usage Examples
- "Run tests with pretty output"
- "Show only failed tests"
- "Run with verbose output"

## Installation

```bash
go install go.dalton.dog/prism@latest
```

Or:
```bash
brew install --cask daltonsw/tap/prism
```

## Examples

```bash
# Run tests
prism

# Verbose output
prism -v

# Failed only
prism -f

# Disable color
prism --no-color

# Benchmarks
prism bench
prism bench "MyBenchmark" ./specific/path
```

## Key Features
- Colorized output
- Pass/fail indicators
- Verbose mode
- Failed-only mode
- Benchmark support
- Configurable defaults
