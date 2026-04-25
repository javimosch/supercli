---
name: cyme
description: Use this skill when the user wants to list USB devices, manage hardware from the terminal, or view USB device information.
---

# cyme Plugin

A beautiful, fast terminal USB device manager. List and manage USB devices with detailed information in a tree view format.

## Commands

### USB Device Management
- `cyme usb list` — List USB devices
- `cyme usb info` — Get USB device information

### Utility
- `cyme _ _` — Passthrough to cyme CLI

## Usage Examples
- "List USB devices"
- "Show USB device info"
- "USB device tree view"
- "Manage USB from terminal"

## Installation

```bash
brew install cyme
```

Or via Cargo:
```bash
cargo install cyme
```

## Examples

```bash
# List USB devices
cyme ls

# Tree view
cyme ls --tree

# Verbose output
cyme ls --verbose

# JSON output
cyme ls --json

# Device info
cyme info /dev/bus/usb/001/001

# Any cyme command with passthrough
cyme _ _ ls --tree
cyme _ _ info 1-1
cyme _ _ dump
```

## Key Features
- **USB** - USB device listing
- **Tree** - Tree view
- **Fast** - Fast performance
- **Beautiful** - Pretty output
- **Info** - Device information
- **Filter** - Device filtering
- **JSON** - JSON output
- **Hardware** - Hardware management
- **System** - System info
- **Terminal** - Terminal native

## Notes
- Requires USB access
- Works on Linux and macOS
- Great for hardware debugging
- Supports multiple output formats
