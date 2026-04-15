---
name: yek
description: Use this skill when the user wants to serialize code files for LLM consumption.
---

# yek Plugin

Fast Rust tool to serialize text-based files in a repository or directory for LLM consumption.

## Commands

### Serialization
- `yek serialize run` — Serialize repository for LLM
- `yek tree show` — Show directory tree only

## Usage Examples

```bash
# Serialize entire repository
yek

# Process specific directory with token limit
yek --tokens 128k src/

# JSON output for AI processing
yek --json --max-size 100KB

# Use glob patterns
yek "src/**/*.ts" "tests/*.rs"

# Output to specific directory
yek --output-dir /tmp/yek src/
```

## Installation

```bash
curl -fsSL https://azimi.me/yek.sh | bash
```

## Key Features
- 230x faster than repomix
- Uses .gitignore rules automatically
- Git history-based prioritization (important files last)
- Token-based context limits
- JSON output for AI pipelines
- Multi-directory and glob pattern support
