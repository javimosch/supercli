---
name: treex
description: Use this skill when the user wants to visualize directory structure, list files in tree format, generate project overviews, or export directory listings in JSON, CSV, Markdown, or Mermaid formats.
---

# treex Plugin

Directory structure visualization CLI with multiple output formats (tree, indent, markdown, mermaid, JSON, CSV) and powerful filters for max-depth, exclusions, gitignore, and metadata.

## Commands

### Directory Visualization
- `treex dir tree` — Generate directory structure visualization

### Utility
- `treex self version` — Print treex version
- `treex _ _` — Passthrough to treex CLI

## Usage Examples
- "Show the directory tree for the current folder"
- "Export the project structure as a Markdown file"
- "Generate a Mermaid diagram of the directory structure"
- "List all files as JSON with sizes and owners"
- "Show only directories, excluding node_modules and .git"
- "Create a tree visualization respecting .gitignore"

## Installation

```bash
go install github.com/shiquda/treex@latest
```

## Examples

```bash
# Basic tree for current directory
treex dir tree

# Tree with max depth of 3
treex dir tree -m 3

# JSON output
treex dir tree -f json

# CSV output for spreadsheet
treex dir tree -f csv

# Markdown output
treex dir tree -f md

# Mermaid diagram output
treex dir tree -f mermaid

# Save tree to a file
treex dir tree -o project-structure.md -f md

# Show file sizes and modification times
treex dir tree -s -M

# Show owners
treex dir tree -O

# Hide hidden files
treex dir tree -H

# Only directories
treex dir tree -D

# Respect .gitignore
treex dir tree -I

# Exclude specific directories or extensions
treex dir tree -e node_modules/,dist/,build/

# Exclude by extension
treex dir tree -e .log,.tmp

# Show icons
treex dir tree -C

# Combine multiple options
treex dir tree -d . -m 4 -f json -s -M -I -H
```

## Key Features

- **Multiple output formats**: tree (default), indent, markdown, mermaid, json, csv
- **Max depth control**: `-m` or `-L` to limit directory depth
- **Size display**: `-s` shows human-readable file sizes
- **Owner display**: `-O` shows file owners
- **Modification time**: `-M` shows file modification times
- **Hidden files**: `-H` hides hidden files and directories
- **Directories only**: `-D` shows only directories
- **Gitignore support**: `-I` automatically applies `.gitignore` rules
- **Exclusion rules**: `-e` to exclude specific directories (`dir/`) or extensions (`.ext`)
- **File output**: `-o` saves output to a file
- **Icons**: `-C` shows emoji icons for files
- **Improved Windows pipe support** with UTF-8 encoding

## Output Formats

- **tree**: Classic tree format with branches (default)
- **indent**: Indented list format
- **md**: Markdown format with headers and lists
- **mermaid**: Mermaid diagram format for documentation
- **json**: Structured JSON with file/directory metadata
- **csv**: CSV format for spreadsheet applications

## Notes

- Run without arguments to generate a tree for the current directory
- `-L` is an alias for `-m` for better compatibility with standard tree commands
- Exclusion rules support both directory names ending with `/` and file extensions
- On Windows, improved pipe support with UTF-8 encoding is available
- Large directory trees may take a moment to process; use `-m` to limit depth
