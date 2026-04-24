---
name: rslint
description: Use this skill when the user wants to lint JavaScript or TypeScript code with a fast, ESLint-compatible linter. rslint is 20-40x faster than ESLint with typed linting enabled by default.
---

# rslint Plugin

Lightning-fast JavaScript/TypeScript linter built with Go and typescript-go. 20-40x faster than ESLint with minimal config, typed linting by default, and ESLint-compatible rules.

## Commands

### Linting
- `rslint lint check` — Lint JavaScript/TypeScript files

### Utility
- `rslint self version` — Print rslint version
- `rslint _ _` — Passthrough to rslint CLI

## Usage Examples
- "Lint the current directory"
- "Lint this TypeScript file"
- "Check for lint errors in the src folder"
- "Run the linter with auto-fix"
- "Show all available lint rules"

## Installation

```bash
npm install -g @rslint/cli
```

Or download a pre-built binary from [GitHub Releases](https://github.com/web-infra-dev/rslint/releases).

## Examples

```bash
# Lint the current directory
rslint lint check

# Lint specific files or directories
rslint lint check src/
rslint lint check src/index.ts

# Lint with auto-fix
rslint _ _ --fix

# Show help for all commands
rslint _ _ --help

# Lint with a specific config file
rslint _ _ --config ./rslint.config.js

# Lint and output results in a specific format
rslint _ _ --format json
```

## Key Features
- **Lightning Fast** — Built with Go and typescript-go, 20-40x faster than ESLint
- **Minimal Configuration** — Typed linting enabled by default, minimal setup required
- **ESLint Compatible** — Compatible with most ESLint and TypeScript-ESLint configurations
- **TypeScript First** — Uses TypeScript Compiler semantics as the single source of truth
- **Project-Level Analysis** — Cross-module analysis by default, more powerful than file-level linting
- **Monorepo Ready** — First-class support for large-scale monorepos with TypeScript project references
- **Batteries Included** — Ships with all TypeScript-ESLint rules and widely-used ESLint rules out of the box
- **Extensible** — Exposes AST, type information, and global checker data for custom rules

## Notes
- rslint is currently in an experimental phase but under active development by the web-infra-dev team (ByteDance)
- It is a fork of tsgolint, building upon the innovative proof-of-concept work by @auvred
- rslint performs cross-module analysis by default, enabling more powerful semantic analysis
- Use `--help` to see all available commands and flags
- For detailed setup, see the [rslint guide](https://rslint.rs/guide/)
