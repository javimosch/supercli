---
name: shfmt
description: Use this skill when the user wants to format shell scripts, beautify bash code, fix shell script formatting, or auto-indent shell files.
---

# shfmt Plugin

Shell script formatter supporting bash, POSIX shell, mksh, and zsh.

## Commands

### Format
- `shfmt format run` — Format a shell script
- `shfmt format write` — Format and write in-place
- `shfmt format list` — List unformatted shell scripts

## Usage Examples
- "Format this shell script"
- "Auto-fix indentation in my bash script"
- "Show which scripts need formatting"
- "Format all .sh files in the project"

## Installation

```bash
go install mvdan.cc/sh/v3/cmd/shfmt@latest
```

## Examples

```bash
# Print formatted script to stdout
shfmt script.sh

# Write in-place
shfmt -w script.sh

# List unformatted files
shfmt -l *.sh

# Set indent width
shfmt -i 2 script.sh

# Use POSIX mode
shfmt -ln posix script.sh

# Format all recursively
shfmt -w .
```
