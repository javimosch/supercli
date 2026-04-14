---
name: ast-grep
description: Use this skill when the user wants to search code structurally using AST patterns, perform linting, or rewrite code automatically across multiple files.
---

# ast-grep Plugin

AST-based code structural search, lint, and rewriting.

## Commands

### Search
- `ast-grep search run` — Search using AST pattern

### Rewrite
- `ast-grep rewrite run` — Rewrite code using pattern and replacement

### Lint
- `ast-grep lint run` — Run linting rules
- `ast-grep scan run` — Scan directory with rules

## Usage Examples
- "Find all usages of $A && $A() pattern in TypeScript"
- "Replace null coalescing patterns"
- "Lint the codebase for specific patterns"
- "Scan src directory for violations"

## Installation

```bash
npm install --global @ast-grep/cli
# or
cargo install ast-grep
# or
brew install ast-grep
```

## Examples

```bash
# Search for AST pattern
ast-grep --pattern 'const $X = $Y' --lang ts

# Rewrite code
ast-grep --pattern '$A && $A()' --lang ts --rewrite '$A?.()'

# Run lint
ast-grep lint

# Scan directory
ast-grep scan src/
```

## Key Features
- Pattern looks like real code
- Supports JS, TS, Python, Rust, Go, Java, etc.
- Use `$VAR` as wildcard for AST nodes
- YAML-based lint rules
-批量 code rewriting