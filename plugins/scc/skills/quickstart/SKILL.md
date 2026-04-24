---
name: scc
description: Use this skill when the user wants to count lines of code, calculate complexity, or estimate effort for codebases.
---

# scc Plugin

Sloc, Cloc and Code: A very fast accurate code counter with complexity calculations and COCOMO estimates written in pure Go. Count lines of code, complexity, and estimate effort.

## Commands

### Code Counting
- `scc code count` — Count lines of code and complexity

### Utility
- `scc _ _` — Passthrough to scc CLI

## Usage Examples
- "Count lines of code"
- "Calculate code complexity"
- "Estimate effort for this project"
- "Show code statistics"

## Installation

```bash
brew install scc
```

Or via Go:
```bash
go install github.com/boyter/scc/v3/cmd/scc@latest
```

## Examples

```bash
# Count code in directory
scc code count .

# Count code with file details
scc code count --by-file .

# JSON output
scc code count --format json

# Calculate complexity
scc code count --complexity

# COCOMO estimates
scc code count --cocomo

# Exclude directories
scc code count --exclude-dir vendor,node_modules

# Count specific files
scc code count src/*.go

# Any scc command with passthrough
scc _ _ --by-file --format json
scc _ _ --complexity --cocomo
```

## Key Features
- **Fast** - Very fast code counting
- **Accurate** - Accurate SLOC counting
- **250+ languages** - Supports many programming languages
- **Complexity** - Cyclomatic complexity calculations
- **COCOMO** - Effort and cost estimates
- **Multiple formats** - JSON, CSV, HTML output
- **By file** - Detailed file-level statistics
- **Exclude patterns** - Ignore specific directories
- **Cross-platform** - Linux, macOS, Windows
- **Git aware** - Can filter by git status

## Notes
- Supports 250+ programming languages
- Can calculate complexity metrics
- COCOMO provides effort estimates
- Great for project statistics
- Can be used in CI/CD pipelines
