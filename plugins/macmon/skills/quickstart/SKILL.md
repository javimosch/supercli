---
name: macmon
description: Use this skill when the user wants to monitor Apple Silicon Mac system metrics (CPU, GPU, ANE power, RAM, temperature) in real-time or via JSON output.
---

# macmon Plugin

Real-time system monitor for Apple Silicon Macs (M1-M5). No sudo required.

## Commands

### Monitoring
- `macmon self version` — Print macmon version
- `macmon pipe metrics` — Output metrics in JSON format for piping to other tools
- `macmon _ _` — Passthrough to macmon CLI

## Usage Examples

- "Monitor my Mac's CPU power usage in JSON format"
- "Get current memory usage and temperature"
- "Pipe macmon output to jq for processing"

## Installation

```bash
brew install macmon
```

## Examples

```bash
# Interactive TUI mode
macmon

# JSON output for piping (10 samples, 500ms interval)
macmon pipe -s 10 -i 500 | jq

# Continuous monitoring
macmon pipe -s 0 -i 1000
```

## Key Features
- No sudo required
- Real-time CPU/GPU/ANE power usage
- CPU utilization per cluster
- RAM/Swap usage
- Temperature monitoring
- JSON output mode for scripting
- Prometheus metrics server mode
