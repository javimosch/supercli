---
name: probe
description: Use this skill when the user wants to search code semantically, extract code blocks with AST context, find patterns using tree-sitter, or analyze code structure.
---

# Probe Plugin

AI-friendly semantic code search engine for large codebases. Combines ripgrep speed with tree-sitter AST parsing.

## Commands

### Search
- `probe search query` — Semantic code search with Elasticsearch-style queries

### Extract
- `probe extract code` — Extract code blocks with full AST context

### Symbols
- `probe symbols list` — List all symbols in files with line numbers

### Query
- `probe query ast` — AST-based structural pattern matching

## Usage Examples

Basic search:
```
probe search "authentication" ./src
probe search "error AND handling" ./
probe search "login OR auth" ./src
```

Extract code:
```
probe extract src/main.rs:42
probe extract src/main.rs#authenticate
probe extract src/main.rs:10-50
```

List symbols:
```
probe symbols src/main.rs
probe symbols src/main.rs --format json
```

AST pattern matching:
```
probe query "async fn $NAME($$$)" --language rust
probe query "function $NAME($$$)" --language javascript
```

## Installation

```bash
npm install -g @probelabs/probe
```

Or via curl:
```bash
curl -fsSL https://raw.githubusercontent.com/probelabs/probe/main/install.sh | bash
```

## Key Features
- AST-aware code understanding (not just text)
- Elasticsearch-style query syntax (AND, OR, NOT, phrases)
- Complete code blocks (not fragmented chunks)
- Zero indexing, instant results
- BM25/TF-IDF hybrid ranking
- Multi-language support (Rust, Python, JS, Go, C++, etc.)
- Fully local - code never leaves your machine
- MCP integration for AI coding assistants