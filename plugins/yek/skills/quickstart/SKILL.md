---
name: yek
description: Use this skill when the user wants to serialize code files for LLM consumption.
---

# yek Plugin

Fast Rust tool to serialize text-based files in a repository or directory for LLM consumption. 230x faster than repomix.

## Commands

### Serialization
- `yek serialize run` — Serialize repository for LLM
- `yek tree show` — Show directory tree only (no file contents)

## Usage Examples

```bash
# Serialize entire repository (writes to temp file, prints path)
yek

# Process specific directory with token limit
yek --tokens 128k src/

# JSON output for AI processing
yek --json --max-size 100KB

# Output to specific directory
yek --output-dir /tmp/yek src/

# Include line numbers
yek --line-numbers src/

# Use glob patterns (quote to prevent shell expansion)
yek "src/**/*.ts" "tests/*.rs"

# Ignore additional patterns
yek --ignore-patterns "*.log" --ignore-patterns "dist/**" src/

# Process multiple directories
yek src/ tests/ docs/
```

## Installation

```bash
curl -fsSL https://azimi.me/yek.sh | bash
```

Or for Windows (PowerShell):
```powershell
irm https://azimi.me/yek.ps1 | iex
```

Or build from source:
```bash
git clone https://github.com/mohsen1/yek
cd yek
cargo install --path .
```

## Key Features
- 230x faster than repomix (written in Rust)
- Uses .gitignore rules automatically
- Git history-based prioritization (important files last in output)
- Token-based context limits (--tokens 128k)
- JSON output for AI pipelines (--json)
- Multi-directory and glob pattern support
- Automatic binary file detection
- Configurable via yek.yaml

## CLI Options
| Flag | Description |
|------|-------------|
| `--json` | JSON output format |
| `--tokens N` | Token limit (e.g., 128k, 100) |
| `--max-size N` | Size limit per chunk (e.g., 10MB, 128K) |
| `--line-numbers` | Include line numbers |
| `--output-dir` | Output directory |
| `--ignore-patterns` | Additional ignore patterns |
| `-t, --tree-header` | Include directory tree |
| `--tree-only` | Show tree only, no contents |

## Output Format
Default text format:
```
>>>> FILE_PATH
FILE_CONTENT
>>>> ANOTHER_FILE
MORE_CONTENT
```

JSON format:
```json
[
  { "filename": "src/main.rs", "content": "..." },
  { "filename": "tests/main.rs", "content": "..." }
]
```
