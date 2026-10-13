---
name: hk
description: Use this skill when the user wants to run linters, set up git hooks, or orchestrate code quality checks with hk.
---

# hk Plugin

hk is a fast git hooks manager and lint/format orchestrator (Rust, by the author of mise). It detects project linters into `hk.pkl`, runs them in parallel over modified files, and shares config between git hooks, local runs, and CI.

## Commands

### Setup
- `hk project init` — Generate hk.pkl config by detecting project linters
- `hk config validate` — Validate hk.pkl without running linters
- `hk hooks install` — Install git hooks in current repo (`--global` for all repos, Git 2.54+)

### Linting
- `hk check run` — Check modified files (staged + unstaged + untracked)
- `hk fix run` — Apply fixes to modified files
- `hk builtins list` — List built-in step definitions
- `hk _ _` — Passthrough to hk CLI

## Usage Examples

- "Set up pre-commit hooks for this project"
- "Run all linters on the files I changed"
- "Fix formatting on modified files"
- "Show me what hk would run via the plan"

## Installation

```bash
cargo install hk --locked
# or: mise use hk
# or: brew install hk
```

## Examples

```bash
# CI: check every file
hk check --all

# Preview which steps/files would run, as JSON
hk check --all --plan --json

# Check one file or one step
hk check src/main.ts
hk check --step eslint

# Apply fixes and stage them
hk fix --stage

# Built-in single-file fixers (work without config)
hk util trailing-whitespace --fix .
hk util check-merge-conflict .
hk util end-of-file-fixer --fix .
```

## Key Features

- Runs linters in parallel with per-file locks (no collisions)
- Builtins for prettier, eslint, ruff, and ~20 zero-dependency `hk util` fixers
- Same `hk.pkl` config powers pre-commit hooks, `hk check`, `hk fix`, and CI
- `--plan --json` previews which steps and files are selected
- `hk util` utilities (trailing whitespace, merge conflicts, private keys) work with no hk.pkl
