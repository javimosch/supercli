---
name: opencli
description: Use this skill when the user wants to convert websites or tools into CLI interfaces, or use opencli to run universal CLI commands.
---

# opencli Plugin

Make Any Website & Tool Your CLI. A universal CLI Hub and AI-native runtime.

## Commands

### Version
- `opencli --version` — Show version information

### Run
- `opencli run <cmd>` — Run a command through opencli

### Convert
- `opencli convert <target>` — Convert a website or tool to CLI interface

### List
- `opencli list` — List available CLI conversions in registry

## Usage Examples
- "Convert a website to CLI"
- "List available CLI tools"
- "Run opencli version"

## Installation

```bash
npm install -g @jackwener/opencli
```

Requires Node.js 18+.

## Examples

```bash
# Check version
opencli --version

# Convert a website to CLI
opencli convert https://example.com

# List available conversions
opencli list

# Run a command
opencli run "some command"
```

## Key Features
- Universal CLI Hub - transform any website/tool to CLI
- AI-native runtime
- Supports websites, Electron apps, and local binaries
- Standardized command-line interface
- Registry of available conversions