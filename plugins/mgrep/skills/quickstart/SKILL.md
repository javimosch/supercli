---
name: mgrep
description: Use this skill when the user wants to search code semantically
---

# Mgrep Plugin

search code semantically

## Commands
- `mgrep self version` — Print mgrep version
- `mgrep _ _` — Passthrough to mgrep CLI

## Usage Examples
- "Search for error handling patterns"
- "Find all authentication code"
- "Semantic search across the codebase"

## Installation

```bash
npm install -g mgrep
```

## Examples
```bash
mgrep "error handling" --lang rust
mgrep "authentication" --dir src/
mgrep "database connection" --context 3
```

## Key Features
- Semantic code understanding
- Context-aware results
- Multiple language support
- Fast indexing
