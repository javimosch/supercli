---
name: gdu
description: Use this skill when the user wants to analyze disk usage, check disk space, or find large files and directories.
---

# gdu Plugin

Fast disk usage analyzer with console interface written in Go. Analyze disk usage with visualization and filtering capabilities.

## Commands

### Disk Analysis
- `gdu disk analyze` — Analyze disk usage

### Utility
- `gdu _ _` — Passthrough to gdu CLI

## Usage Examples
- "Analyze disk usage"
- "Check disk space"
- "Find large directories"
- "Show disk usage"

## Installation

```bash
brew install gdu
```

Or via Go:
```bash
go install github.com/dundee/gdu/v5/cmd/gdu@latest
```

## Examples

```bash
# Analyze current directory
gdu disk analyze .

# Analyze specific path
gdu disk analyze /home/user

# Color output
gdu disk analyze . --color always

# Show hidden files
gdu disk analyze . --show-hidden

# Don't follow symlinks
gdu disk analyze . --no-follow

# Ignore directories
gdu disk analyze . --ignore-dirs node_modules,vendor

# Any gdu command with passthrough
gdu _ _ . --color always
gdu _ _ /home/user --show-hidden
```

## Key Features
- **Fast** - Written in Go for performance
- **Visual** - Colored output for easy reading
- **Filtering** - Ignore specific directories
- **Symlinks** - Follow or ignore symlinks
- **Hidden files** - Show or hide hidden files
- **Cross-platform** - Linux, macOS, Windows
- **Interactive** - Interactive mode available
- **Export** - Export analysis data
- **Recursive** - Analyze nested directories
- **Efficient** - Caching for faster repeated scans

## Notes
- Default analyzes current directory
- Uses colors to highlight large directories
- Can be used in CI/CD pipelines
- Great for disk cleanup
- Supports multiple output formats
