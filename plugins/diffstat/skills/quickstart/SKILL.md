---
name: diffstat
description: Use this skill when the user wants to see a quick histogram summary of changes in a diff or patch file.
---

# diffstat Plugin

diffstat creates histogram stats from diff output.

## Commands
- `diffstat <resource> <action>` — Execute diffstat commands
- `diffstat self version` — Print diffstat version
- `diffstat _ _` — Passthrough to diffstat CLI

## Usage Examples

- "show change statistics for a patch"
- "pipe git diff through diffstat"
- "analyze diff impact across files"

## Installation

```bash
brew install diffstat
```

## Key Features
- Diff/patch histogram generation
- File-level change statistics
- Addition/deletion count per file
- Bar chart visual summary
- Piped output support
- Code review integration
