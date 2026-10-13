---
name: usage
description: Use this skill when the user wants declarative CLI definitions — generate shell completions, help docs, and arg parsing from a usage.kdl spec (jdx's toolkit, powers mise).
---

# usage Plugin

usage is jdx's CLI spec toolkit: describe flags/args/subcommands once in `usage.kdl` (or embedded `#USAGE` comments in a script) and generate completions, docs, and parsing.

## Commands

### Generation
- `usage completion generate` — Emit completions (`usage generate completion bash|zsh|fish <spec>`)
- `usage json generate` — Emit spec as JSON
- `usage spec list` — List commands in spec
- `usage self version` — Show version
- `usage _ _` — Passthrough (`usage exec`, `usage complete`, `usage g md`)

## Usage Examples

- "Generate zsh completions for my script"
- "Export my CLI spec to markdown docs"
- "Parse args declaratively in a bash script"

## Installation

```bash
cargo install usage-cli
# or: mise use usage
# or: brew install usage
```

## Examples

```bash
usage generate completion zsh usage.kdl > _mycli
usage g md -f usage.kdl > CLI.md          # markdown docs
usage exec mycli -- arg1 arg2             # parse args via spec
```

## Key Features

- One `usage.kdl` spec → completions (bash/zsh/fish), help, markdown, JSON
- Embed `#USAGE` comments directly in bash scripts for self-documenting CLIs
- Powers mise's completion system; standalone binary works anywhere
