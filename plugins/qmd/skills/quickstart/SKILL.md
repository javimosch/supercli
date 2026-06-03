---
name: qmd
description: Use this skill when the user wants to search documentation locally
---

# Qmd Plugin

search documentation locally

## Commands
- `qmd self version` — Print qmd version
- `qmd _ _` — Passthrough to qmd CLI

## Usage Examples
- "Search docs for API reference"
- "Find documentation about configuration"
- "Quick search across all docs"

## Installation

```bash
npm install -g qmd
```

## Examples
```bash
qmd search "authentication"
qmd index ./docs/
qmd query "deployment guide" --limit 10
```

## Key Features
- Local documentation search
- Fast full-text indexing
- Markdown-aware results
- Configurable search paths
