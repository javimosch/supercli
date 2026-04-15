---
name: jina-grep
description: Use this skill when the user wants to search code or text using semantic/natural language queries, find code based on meaning rather than exact text matches, or use AI-powered grep alternatives.
---

# jina-grep Plugin

Semantic grep powered by Jina embeddings v5 (MLX on Apple Silicon).

## Commands

### Search
- `jina-grep search run` — Semantic search for natural language query

## Usage Examples
- "Find code that does X using semantic search"
- "Search for code with meaning similar to..."
- "Find patterns based on intent rather than keywords"

## Installation

```bash
pip install jina-grep-cli
```

## Examples

```bash
# Basic semantic search
jina-grep "authentication logic"

# Search in specific directory
jina-grep "parse JSON response" ./src

# With additional CLI flags
jina-grep --num-results 10 "error handling"
```

## Common Flags
- `--num-results`, `-n` — Number of results to return
- `--output-format`, `-o` — Output format (text, json)
- `--help` — Show all available options

## Notes
- Uses Jina embeddings v5 for semantic understanding
- MLX acceleration on Apple Silicon
- Works best for natural language queries about code intent
