---
name: smem
description: Use this skill when the user wants to report memory usage, analyze process memory consumption, or compare RSS/PSS/USS metrics.
---

# smem Plugin

Memory reporting tool that provides unique insights into process memory usage including RSS, PSS (Proportional Set Size), and USS (Unique Set Size).

## Commands

### Version
- `smem self version` — Print smem version

### Utility
- `smem _ _` — Passthrough to smem CLI

## Usage Examples
- "Show memory usage per process"
- "Report memory with PSS and USS metrics"
- "Top memory-consuming processes"
- "System-wide memory summary"

## Installation

```bash
pip install smem
```

Or via apt:
```bash
sudo apt-get install smem
```

## Examples

```bash
# Show memory usage per process (default: RSS)
smem _ _

# Show memory with PSS and USS metrics
smem _ _ -p -s uss

# Top 10 memory-consuming processes by PSS
smem _ _ -t -s pss -r 10

# System-wide memory summary
smem _ _ -w

# Memory usage by user
smem _ _ -u

# Show memory for a specific process name
smem _ _ -P firefox

# Filter by PID
smem _ _ -p -P 1234 -s uss

# Print version
smem self version

# Show help
smem _ _ --help
```

## Key Features
- **RSS** — Resident Set Size (total physical memory)
- **PSS** — Proportional Set Size (shared pages divided proportionally)
- **USS** — Unique Set Size (unshared memory, counts each page once)
- **Per-user** — Aggregate memory by user
- **Per-process** — Show memory per individual process
- **System-wide** — Summary of total memory usage
- **Filtering** — Filter by PID or process name
- **Bar charts** — Visual memory usage display with `--bar`
- **Auto-refresh** — Real-time monitoring with `--autorefresh`
