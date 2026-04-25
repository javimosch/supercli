---
name: micro
description: Use this skill when the user wants to edit files in a terminal text editor or use micro editor from the command line.
---

# micro Plugin

A modern and intuitive terminal-based text editor. A simple, easy-to-use terminal text editor with mouse support and keybindings.

## Commands

### File Editing
- `micro file edit` — Edit file in micro editor

### Utility
- `micro _ _` — Passthrough to micro CLI

## Usage Examples
- "Edit file in micro"
- "Open micro editor"
- "Terminal text editor"
- "Edit with micro"

## Installation

```bash
brew install micro
```

Or via Go:
```bash
go install github.com/zyedidia/micro/cmd/micro@latest
```

## Examples

```bash
# Edit file
micro myfile.txt

# Edit with clean mode
micro --clean myfile.txt

# Any micro command with passthrough
micro _ _ config.txt
micro _ _ --clean script.sh
micro _ _ README.md
```

## Key Features
- **Editor** - Text editing
- **Terminal** - Terminal native
- **Mouse** - Mouse support
- **Keybindings** - Customizable bindings
- **Simple** - Simple interface
- **Modern** - Modern design
- **Syntax** - Syntax highlighting
- **Plugins** - Plugin support
- **CLI** - Command line native
- **Easy** - Easy to use

## Notes
- Easy to learn
- Mouse support included
- Customizable keybindings
- Great for terminal editing
- Supports plugins
