---
name: murex
description: Use this skill when the user wants a smarter shell with typed pipelines — structured data (JSON/YAML/CSV) flowing through pipelines without fragile text parsing.
---

# murex Plugin

murex is a shell and scripting environment where pipelines carry typed data — JSON, YAML, CSV, TSV — with builtins to query and transform them, plus inline hints, spellchecking, and event-driven automation.

## Commands

### Shell
- `murex shell exec "<code>"` — Run murex code (`murex -c`)
- `murex script run <file>` — Execute a .mx script
- `murex self version` — Show version
- `murex _ _` — Passthrough to murex CLI (run `murex` alone for the REPL)

## Usage Examples

- "Query a JSON field from a curl response in the shell"
- "Run this murex script"
- "A shell that understands YAML pipelines"

## Installation

```bash
go install github.com/lmorg/murex@latest
# or: brew install murex
# or: https://github.com/lmorg/murex/releases
```

## Examples

```bash
murex                          # interactive REPL with hinting
murex -c 'out "hello"'         # run code
curl -s api.com/x | murex -c 'stdin -> [ .name ]'
murex deploy.mx                # run a script
```

## Key Features

- Typed pipelines: JSON/YAML/CSV/TSV parsed natively, no awk/sed glue
- Inline hinting & autocompletion with man-page integration
- Safer scripting: `try`/`catch`, strict modes, readable `->`/`=>` operators
- HTTP/SMTP/embedded-SQL builtins for DevOps workflows
