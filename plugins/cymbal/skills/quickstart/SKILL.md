---
name: cymbal
description: Use this skill when the user wants to navigate code, trace dependencies, investigate symbols, or analyze the impact of changes across a codebase.
---

# cymbal Plugin

Language-agnostic code navigation CLI powered by tree-sitter.

## Commands

### Symbol
- `cymbal symbol investigate` — Investigate a symbol (source + callers + impact)
- `cymbal symbol trace` — Trace dependencies of a symbol
- `cymbal symbol impact` — Show upstream blast radius of a symbol

### Repo
- `cymbal repo index` — Build or refresh the repo index

## Usage Examples
- "Investigate the handleAuth function"
- "Trace dependencies of UserModel"
- "Show the impact of changing this symbol"
- "Index the current repository"

## Installation

```bash
brew install 1broseidon/tap/cymbal
```

## Examples

```bash
# Investigate a symbol
cymbal investigate handleAuth

# Trace with graph
cymbal trace handleAuth --graph

# Impact analysis
cymbal impact handleAuth

# Index repo
cymbal index .
```

## Key Features
- Tree-sitter powered parsing
- SQLite-based incremental indexing
- Dependency tracing and impact analysis
- Graph output (Mermaid, dot, JSON)
- Batch mode for multiple symbols
- Auto-refreshes on code changes
