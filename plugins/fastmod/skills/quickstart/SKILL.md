---
name: fastmod
description: Use this skill when the user wants to perform bulk search and replace across a codebase, refactor code patterns, or make automated substitutions.
---

# fastmod Plugin

A fast partial replacement for codemod. Interactive tool for making fast, semi-automated substitutions across a codebase.

## Commands

### Code Replacement
- `fastmod code replace` — Search and replace across codebase

### Utility
- `fastmod _ _` — Passthrough to fastmod CLI

## Usage Examples
- "Search and replace in codebase"
- "Bulk code refactoring"
- "Automated substitutions"
- "Codemod replacement"

## Installation

```bash
brew install fastmod
```

Or via Cargo:
```bash
cargo install fastmod
```

## Examples

```bash
# Simple replacement
fastmod code replace "oldFunction" "newFunction" --dir ./src

# Accept all changes
fastmod code replace "oldFunction" "newFunction" --dir ./src --accept-all

# Regex pattern
fastmod code replace "foo\\(bar\\)" "foo(baz)" --dir ./src

# Any fastmod command with passthrough
fastmod _ _ "old" "new" --dir ./src
fastmod _ _ "old" "new" --dir ./src --accept-all
```

## Key Features
- **Fast** - High performance
- **Regex** - Regex support
- **Interactive** - Interactive mode
- **Batch** - Batch mode
- **Dry-run** - Preview changes
- **Git** - Git integration
- **Files** - File filtering
- **Case** - Case sensitivity
- **Whole word** - Word boundaries
- **Codemod** - Codemod alternative

## Notes
- Great for bulk refactoring
- Use --accept-all for automation
- Supports regex patterns
- Preview before applying
