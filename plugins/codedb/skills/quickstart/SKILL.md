# codedb Skill

Use the codedb plugin for fast, structured code intelligence queries via the `codedb` CLI. It provides tree-sitter-based structural parsing, trigram-accelerated full-text search, O(1) inverted word index, and reverse dependency graphs.

## Quick Start

### 1. Install
```bash
codedb --version
```

### 2. Explore a Codebase

Get the file tree:
```bash
dcli codedb tree run
```

Outline symbols in a specific file:
```bash
dcli codedb outline run --path src/main.zig
```

### 3. Find Symbols and Search

Find where a symbol is defined:
```bash
dcli codedb find run --name AgentRegistry
```

Full-text search (trigram-accelerated):
```bash
dcli codedb search run --query "handleAuth"
```

Regex search:
```bash
dcli codedb search regex --pattern "handle[A-Z]\w+"
```

Exact word lookup (O(1) inverted index):
```bash
dcli codedb word run --identifier Store
```

### 4. Recently Modified Files

```bash
dcli codedb hot run
```

### 5. Nuke Codedb Data

Remove all codedb data, snapshots, and kill processes:
```bash
dcli codedb nuke run
```

## Agent Notes

- codedb CLI pays ~55ms process startup per invocation. For repeated queries, consider running `codedb serve` as a long-running HTTP server on `:7719` instead.
- Results are structured (JSON-like) rather than raw line dumps — significantly fewer tokens for AI agents.
- Sensitive files (.env, credentials, keys) are auto-excluded from indexing.
- Telemetry is on by default. Disable with `CODEDB_NO_TELEMETRY=1` or `--no-telemetry`.
- For passthrough of undocumented subcommands, use `dcli codedb _ _ <args...>` (e.g., `dcli codedb _ _ -- --help`).
