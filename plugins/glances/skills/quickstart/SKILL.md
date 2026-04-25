---
name: glances
description: Use this skill when the user wants to monitor system performance metrics.
---

# Glances Plugin

Cross-platform system monitoring tool with JSON/CSV output support for scripting.

## Commands

### System Monitoring
- `glances stats stdout` — Display stats in stdout format
- `glances stats json` — Display stats in JSON format
- `glances stats csv` — Display stats in CSV format

## Usage Examples
- "glances stats json --metrics cpu,mem"
- "glances stats csv --metrics now,cpu.user,mem.used,load"
- "glances stats stdout --metrics cpu.user,mem.used,load"

## Installation

```bash
pip install glances
# or
brew install glances
```

## Examples

```bash
# Display CPU and memory stats in JSON
glances --stdout-json cpu,mem

# Display timestamped metrics in CSV
glances --stdout-csv now,cpu.user,mem.used,load

# Display specific metrics in plain text
glances --stdout cpu.user,mem.used,load

# Get a quick system snapshot
glances --fetch
```

## Key Features
- Real-time system monitoring (CPU, memory, disk, network)
- JSON, CSV, and stdout output formats for scripting
- Container monitoring (Docker, LXC)
- Process monitoring
- Temperature, voltage, fan speed monitoring
- Remote monitoring via web interface
- Export stats to external databases
- MCP server for AI assistant integration
