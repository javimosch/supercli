---
name: shellcheck
description: Use this skill when the user wants to lint shell scripts, check bash/sh scripts for errors, find bugs in shell code, or improve script quality.
---

# shellcheck Plugin

Static analysis tool for shell scripts (bash/sh).

## Commands

### Check
- `shellcheck check run` — Lint a shell script
- `shellcheck check json` — Lint script and output JSON

## Usage Examples
- "Check this shell script for errors"
- "Lint my bash script"
- "Find bugs in deploy.sh"
- "Check script and output as JSON"

## Installation

```bash
brew install shellcheck
```

## Examples

```bash
# Basic check
shellcheck myscript.sh

# JSON output
shellcheck --format json myscript.sh

# Set minimum severity
shellcheck --severity=warning myscript.sh

# Check multiple files
shellcheck *.sh

# Source files
shellcheck --source-path=SRC myscript.sh
```

## Key Features
- 300+ built-in checks
- JSON, CheckStyle, GCC output formats
- CI integration
- Editor integrations (VSCode, Vim, Emacs)
