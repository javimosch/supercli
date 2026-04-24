---
name: bat
description: Use this skill when the user wants to view files with syntax highlighting, read code with color formatting, or use a better alternative to cat.
---

# bat Plugin

A cat(1) clone with syntax highlighting, git integration, automatic paging, and support for showing non-printable characters.

## Commands

### File Viewing
- `bat file view` — View file with syntax highlighting

### Utility
- `bat _ _` — Passthrough to bat CLI

## Usage Examples
- "View this file with syntax highlighting"
- "Read the code with colors"
- "Show me the contents of this file"
- "Display file with line numbers"

## Installation

```bash
brew install bat
```

Or via Cargo:
```bash
cargo install bat
```

## Examples

```bash
# View file with syntax highlighting
bat file view main.py

# View multiple files
bat file view main.py src/utils.js

# Specify language for syntax highlighting
bat file view --language rust file.txt

# Show line numbers
bat file view --number main.py

# Show specific line range
bat file view --line-range 10:20 main.py

# Set output style (auto, full, plain, changes)
bat file view --style plain main.py

# Set color mode (auto, never, always)
bat file view --color never main.py

# Control paging (auto, never, always)
bat file view --paging never main.py

# Control text wrapping (auto, never, character)
bat file view --wrap never main.py

# Set syntax highlighting theme
bat file view --theme Monokai main.py

# Show non-printable characters
bat file view --show-all main.py

# Read from stdin
echo "hello" | bat file view -

# Any bat command with passthrough
bat _ _ --line-range 1:50 main.py
bat _ _ --style changes --number main.py
```

## Key Features
- **Syntax highlighting** — Automatic detection for 200+ languages
- **Git integration** — Show git diff for modified lines
- **Automatic paging** — Page large files automatically
- **Line numbers** — Optional line number display
- **File concatenation** — View multiple files like cat
- **Non-printable characters** — Show special characters
- **Themes** — Customizable syntax highlighting themes
- **Output styles** — Full, plain, changes, or auto
- **Color control** — Enable/disable colors
- **Text wrapping** — Control text wrapping behavior
- **Pipeline support** — Read from stdin

## Notes
- Automatically detects file type for syntax highlighting
- Uses less as pager by default
- Can be configured as git pager
- Supports custom themes and syntaxes
- Configuration file at ~/.config/bat/config
