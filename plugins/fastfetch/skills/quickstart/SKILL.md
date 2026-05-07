---
name: fastfetch
description: Use this skill when the user wants to display system information, check hardware specs, view OS details, or get system diagnostics in JSON format.
---

# fastfetch Plugin

A maintained, feature-rich, performance-oriented system information tool.

## Commands

### System
- `fastfetch system info` — Display system information
- `fastfetch system json` — Display system info as JSON
- `fastfetch modules list` — List all supported modules

## Usage Examples
- "Show my system information"
- "Get system info in JSON format"
- "What hardware am I running?"

## Installation

```bash
brew install fastfetch
```

## Examples

```bash
# Basic system info
fastfetch

# JSON output
fastfetch --format json

# Specific modules
fastfetch -s os:kernel:cpu:gpu:memory:disk

# List all modules
fastfetch -c all.jsonc
```

## Key Features
- 100+ system modules (OS, kernel, CPU, GPU, memory, disk, network, etc.)
- JSON output for scripting
- Highly customizable via JSONC config
- Active development (neofetch successor)
