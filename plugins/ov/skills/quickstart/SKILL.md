---
name: ov
description: Use this skill when the user wants a modern terminal pager — view logs with follow mode, search incrementally, highlight matches, or display CSV/TSV in column mode instead of less or more.
---

# ov Plugin

Feature-rich terminal pager with column mode, incremental search, multicolor highlighting, and follow mode. A modern replacement for `less` and `more`.

## Installation

```bash
go install github.com/noborus/ov@latest
# or
brew install noborus/tap/ov
```

Download binaries from [GitHub Releases](https://github.com/noborus/ov/releases).

## Basic Usage

```bash
# Page a file
ov large.log

# Pipe output
kubectl logs deployment/api | ov

# Follow logs (like tail -f)
ov --follow /var/log/syslog

# Column mode for CSV/TSV
ov --column-mode data.csv
```

## Key Features

- Incremental search (`/`) with highlight
- Follow mode for live log streaming
- Column mode for tabular data
- Section headers and multicolor syntax
- Mouse and keyboard navigation

## Usage Examples

- "Page this log file with search"
- "Follow nginx access logs in real time"
- "View this CSV in aligned columns"

## SuperCLI

```bash
sc ov _ _ large.log
sc plugins learn ov
```
