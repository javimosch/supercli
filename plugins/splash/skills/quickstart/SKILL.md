---
name: splash
description: Use this skill when the user wants to colorize log output, highlight errors, or parse and beautify structured logs from the command line.
---

# splash Plugin

Add beautiful, adaptive colors to make logs easier to read.

## Commands

### Colorize
- `splash log colorize` — Colorize log output from stdin

## Usage Examples
- "Colorize JSON logs"
- "Highlight errors in log output"
- "Search and highlight patterns"

## Installation

```bash
brew install joshi4/splash/splash
```

Linux:
```bash
curl -fsSL https://install.getsplash.sh | sh
```

## Examples

```bash
# Basic usage
echo '{"timestamp":"2025-01-19T10:30:00Z","level":"ERROR","message":"Connection failed"}' | splash

# Highlight errors
go test -v ./... | splash -s "ERROR"

# Regex search
cat access.log | splash -r "[45]\d\d"

# Continuous output
while true; do echo "$(date) INFO Server started"; done | splash
```

## Key Features
- Auto-detection of 16+ log formats
- Mixed formats in single stream
- String or regex search highlighting
- Adaptive colors for light/dark terminals
- Zero configuration
- Streaming performance
