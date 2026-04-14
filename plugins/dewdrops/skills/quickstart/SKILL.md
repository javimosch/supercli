---
name: dewdrops
description: Use this skill when the user wants to serialize a Git repository into a single Markdown file for LLM context, generate code reviews, or create lightweight structural overviews of codebases.
---

# DewDrops Plugin

Serialize Git repositories into Markdown for LLM context stuffing.

## Commands

### Full Repository Dump
- `dewdrops dump full` — Serialize entire repo to Markdown

### Repo Map (Lightweight Overview)
- `dewdrops map show` — Structural overview with signatures + token estimates
- `--extensions go,py` — Filter by file extensions

### Scoped Selection
- `dewdrops dump scoped` — Dump only specified files/directories

### Change Review
- `dewdrops review changes` — Generate map + diff + content for recent changes

## Usage Examples
- "Dump entire repo to Markdown"
- "Show me the structure of this repo with signatures"
- "Show only Go and Python files"
- "Review changes since main branch"
- "Dump only the src directory"

## Typical Workflow

1. `dewdrops map show .` — Get overview, paste to LLM
2. LLM requests specific files
3. `dewdrops dump scoped --paths src/main.go,lib/utils.go .` — Provide requested files

## Supported Extensions for Map
- Go, Python, JavaScript/TypeScript, Rust, Java/Kotlin
- Ruby, PHP, C/C++, Shell, SQL, Markdown