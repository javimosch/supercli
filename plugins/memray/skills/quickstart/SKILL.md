---
name: memray
description: Use this skill when the user wants to profile Python memory usage, find memory leaks, generate flame graphs, or analyze Python application memory behavior.
---

# memray Plugin

Memory profiler for Python applications with live flame graphs and reports.

## Commands

### Run
- `memray run profile` — Profile a Python script

### Flamegraph
- `memray flamegraph generate` — Generate a flame graph from a snapshot

### Table
- `memray table generate` — Generate a table report from a snapshot

## Usage Examples
- "Profile this Python script for memory usage"
- "Generate a flame graph from the memory snapshot"
- "Show memory allocations in a table"

## Installation

```bash
pip install memray
```

## Examples

```bash
# Profile a script
memray run my_script.py

# Profile and generate live flamegraph
memray run --live my_script.py

# Generate flame graph from snapshot
memray flamegraph output.bin

# Generate table report
memray table output.bin

# Show statistics
memray stats output.bin

# Track specific function
memray run -f my_function my_script.py
```
