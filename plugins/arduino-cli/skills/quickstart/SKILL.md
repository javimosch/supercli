---
name: arduino-cli
description: Use this skill when the user wants to compile Arduino sketches, manage boards, or work with Arduino hardware from the command line.
---

# arduino-cli Plugin

Arduino command line interface. Compile, upload, and manage Arduino sketches, boards, and libraries from the command line.

## Commands

### Sketch Compilation
- `arduino-cli sketch compile` — Compile an Arduino sketch

### Board Management
- `arduino-cli board list` — List connected boards

### Utility
- `arduino-cli _ _` — Passthrough to arduino-cli

## Usage Examples
- "Compile Arduino sketch"
- "List Arduino boards"
- "Upload to Arduino"
- "Manage Arduino hardware"

## Installation

```bash
brew install arduino-cli
```

## Examples

```bash
# Compile sketch
arduino-cli sketch compile ./MySketch --fqbn arduino:avr:uno

# List boards
arduino-cli board list

# With timeout
arduino-cli board list --timeout 10

# Any arduino-cli command with passthrough
arduino-cli _ _ compile ./MySketch
duino-cli _ _ upload ./MySketch --port /dev/ttyACM0
```

## Key Features
- **Compile** - Sketch compilation
- **Upload** - Upload to boards
- **Boards** - Board management
- **Libraries** - Library management
- **Cores** - Core management
- **FQBN** - Board name support
- **Serial** - Serial monitoring
- **CLI** - Full CLI interface
- **Cross-platform** - Linux, macOS, Windows
- **Embedded** - IoT development

## Notes
- Requires Arduino board
- Supports all compatible boards
- Great for CI/CD builds
- Perfect for automation
