---
name: colordiff
description: Use this skill when the user wants to view diff output with color highlighting for easier code review.
---

# colordiff Plugin

colordiff adds syntax color to diff output.

## Commands
- `colordiff <resource> <action>` — Execute colordiff commands
- `colordiff self version` — Print colordiff version
- `colordiff _ _` — Passthrough to colordiff CLI

## Usage Examples

- "show colored diff between two files"
- "pipe git diff through colordiff"
- "review patch file with color highlighting"

## Installation

```bash
brew install colordiff
```

## Key Features
- Color-highlighted diff output
- Green additions, red deletions
- Metadata highlighting
- Standard diff wrapper
- Pipe-compatible for git diff integration
- Improved terminal readability
