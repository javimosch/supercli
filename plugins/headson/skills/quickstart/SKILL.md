---
name: headson
description: Use this skill when the user wants to preview, summarize, or peek at structured data files (JSON, YAML) or source code without loading the full content.
---

# headson Plugin

Head/tail for structured data — summarize and preview JSON, YAML, and source code with configurable budgets, tree views, and grep-like filtering.

## Commands

### Data Preview
- `headson data preview` — Preview and summarize structured data files or stdin

### Utility
- `headson self version` — Print hson version
- `headson _ _` — Passthrough to hson CLI

## Usage Examples
- "Preview the first 500 characters of this JSON file"
- "Summarize all JSON files in the logs directory"
- "Preview a YAML config file with detailed comments"
- "Show a tree view of all source files"
- "Preview error lines from log files"

## Installation

```bash
cargo install headson
```

## Examples

```bash
# Preview a JSON file with default budget
headson data preview data.json

# Preview with a larger character budget
headson data preview -c 800 data.json

# Preview a JSON stream from stdin
curl -sS 'https://api.github.com/repos/kantord/headson' | headson data preview -c 800

# Preview many files with a single total budget
headson data preview -c 200 -C 1200 logs/*.json

# Machine-readable preview (strict JSON)
headson data preview -c 200 -f json -t strict data.json

# Preview YAML with detailed comments
headson data preview -c 400 -f yaml -t detailed config.yaml

# Grep-like: keep error/warning lines visible while summarizing
headson data preview --grep 'error|warning' -c 200 -C 1200 logs/*.json

# Tree-like view of source files
headson data preview --tree --glob 'src/**/*' -c 160 -C 1200

# Source code outline (keeps lines intact, omits blocks under tight budgets)
headson data preview -n 20 src/main.py
```

## Key Features
- Preview JSON, YAML, and source code files with configurable character budgets
- Per-file budget (`-c`) and total budget (`-C`) across all files
- Machine-readable output in JSON or YAML format (`-f`, `-t`)
- Grep-like filtering to keep matching lines visible (`--grep`)
- Tree-like view with inline previews (`--tree`)
- Glob pattern support for batch file selection (`--glob`)
- Source code outline with line-count budgets (`-n`)
- Reads from stdin or file arguments
- Non-zero exit on parse errors

## Flags

- **`-c <N>`** — Character budget per file (default: 200)
- **`-C <N>`** — Total character budget across all files
- **`-f <format>`** — Output format: `json`, `yaml`
- **`-t <type>`** — Type/level: `strict`, `detailed`
- **`--grep <pattern>`** — Keep lines matching this regex visible
- **`--tree`** — Show tree-like view with inline previews
- **`--glob <pattern>`** — Glob pattern for file selection
- **`-n <N>`** — Line count for source code outline (keeps lines intact)

## Notes
- On parse errors, hson exits non-zero and prints the error to stderr
- Multiple input files are supported; omit to read from stdin
- The default character budget is 200 per file
- Use `-t strict` for machine-readable JSON/YAML output without extra comments
