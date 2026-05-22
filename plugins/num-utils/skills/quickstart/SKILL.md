---
name: num-utils
description: Use this skill when the user needs to perform math operations on numbers piped from the command line — average, sum, normalize, or generate random numbers without awk.
---

# num-utils Plugin

num-utils provides a collection of numeric processing tools: average, bound, interval, normalize, random, range, and sum. Each operates on numbers piped via stdin.

## Commands

- `num-utils _ _ <args>` — Passthrough

## Usage Examples

- "calculate the average of these numbers"
- "sum a column of numbers from a file"
- "generate 10 random numbers between 1 and 100"
- "normalize a set of values to 0-1 range"

## Installation

```bash
brew install num-utils
```

## Key Features
- `average` — calculate mean of piped numbers
- `bound` — clamp values to a range
- `interval` — generate sequential numbers
- `normalize` — scale values to 0-1 range
- `random` — generate random numbers
- `range` — find min/max of values
- `sum` — total of all input numbers
- Piped stdin/stdout integration
- Lightweight, no dependencies
