---
name: swiftsearch
description: Use this skill when the user wants to perform fast file and content searches using an inverted index built with Go's concurrent processing.
---

# SwiftSearch Plugin

Blazing-fast command-line search tool built with Go. Recursively scans directories, builds an inverted index, and instantly finds files matching queries in both filenames and file contents.

## Commands

### Search Operations
- `swiftsearch files search <directory> <query>` — Search for files matching query in both filenames and contents
- `swiftsearch _ _ -- <directory> <query> --name-only` — Search only filenames (skip content search)
- `swiftsearch _ _ -- <directory> <query> --case-sensitive` — Enable case-sensitive search
- `swiftsearch _ _ -- <directory> <query> --max-results 20` — Limit number of results

## Usage Examples

```bash
# Basic content search in directory
swiftsearch files search ~/Documents "error handling"

# Filename only search
swiftsearch files search . "config.yaml" --name-only

# Case-insensitive search (default)
swiftsearch files search src "TODO"

# Case-sensitive search
swiftsearch files search src "TODO" --case-sensitive

# Limit results
swiftsearch files search . "function" --max-results 5

# Search current directory
swiftsearch files search . "import"
```

## Installation

```bash
git clone https://github.com/Kritagya123611/SwiftSearch.git
cd SwiftSearch
go build -o swiftsearch
sudo mv swiftsearch /usr/local/bin/  # optional
```

Requires Go 1.19+.

## Key Features

- **Instant Search:** Sub-second lookup via in-memory inverted index
- **Dual-Mode Matching:** Filename + text content search
- **Smart Indexing:** Optimized recursive scanning for large directories
- **Concurrent Processing:** Uses Go goroutines for parallel directory scanning
- **Channel-based Streaming:** Results appear instantly without waiting for full scan
- **Lightweight CLI:** No external dependencies — single binary deployment
- **Cross-Platform:** Works on Windows, macOS, and Linux

## Performance

- Initial indexing: 10–30s for large projects
- Subsequent searches: Instant (sub-second)
- Ideal for repeated searches in the same directory
- Scalable for large & deep directory trees

## How It Works

1. **Concurrent Directory Scan** — Recursive + parallel traversal using Goroutines
2. **Index Phase** — Creates fast lookup structure: `word/filename → list of file paths`
3. **Channel-based Query Result Streaming** — Matches sent instantly without blocking
4. **Smart Output** — Collects results from channels & prints as found

## CLI Flags

- `--name-only` — Search only filenames (skip content)
- `--case-sensitive` — Enable case-sensitive search
- `--max-results N` — Limit number of results (default: 10)
- `--help` — Show help commands

## Use Cases

- Search code for specific functions or variables
- Find configuration files across projects
- Locate documentation containing specific terms
- Quick content search in large codebases
- System administration file searches