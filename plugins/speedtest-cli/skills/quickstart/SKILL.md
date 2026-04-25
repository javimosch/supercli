---
name: speedtest-cli
description: Use this skill when the user wants to test internet bandwidth.
---

# Speedtest-cli Plugin

Command line interface for testing internet bandwidth using speedtest.net.

## Commands

### Bandwidth Testing
- `speedtest-cli test run` — Run bandwidth speed test
- `speedtest-cli servers list` — List available speedtest.net servers

## Usage Examples
- "speedtest-cli test run --json"
- "speedtest-cli test run --simple"
- "speedtest-cli test run --server 1234"

## Installation

```bash
pip install speedtest-cli
```

## Examples

```bash
# Run basic speed test
speedtest-cli

# Simple output (minimal verbosity)
speedtest-cli --simple

# JSON output for scripting
speedtest-cli --json

# CSV output for data analysis
speedtest-cli --csv

# Test against specific server
speedtest-cli --server 1234

# Test download only
speedtest-cli --no-upload

# Test with bytes instead of bits
speedtest-cli --bytes

# Generate shareable result URL
speedtest-cli --share
```

## Key Features
- Download and upload speed testing
- JSON and CSV output for automation
- Server selection and filtering
- Single connection mode for realistic file transfer simulation
- Share results via URL
- Latency measurement
