---
name: publint
description: Use this skill when the user wants to lint an npm package for packaging/publishing errors with publint before releasing it.
---

# publint Plugin

publint checks an npm package for the packaging mistakes that break consumers:
`exports` map errors, missing `types`/`typesVersions`, `files` gaps, ESM/CJS format
mismatches, deprecated fields, and more. Run before `npm publish`.

## Commands

### Linting
- `publint pkg lint [dir]` — Lint a package directory
- `publint _ _` — Passthrough to publint CLI

## Usage Examples

- "Lint this package before I publish it"
- "Check my exports map is correct"
- "Lint the packed tarball, not just package.json"

## Installation

```bash
npm install -g publint
# or: npx publint
```

## Examples

```bash
# Basic lint
publint

# Strict mode — extra checks for libraries
publint --strict

# Lint the real publish artifact (runs npm pack internally)
publint --pack

# JSON output for CI
publint --level warning --format json 2>/dev/null || publint --json
```

## Key Features

- Validates `exports`, `main`, `module`, `types`, `typesVersions`, `files`, `bin`
- `--pack` lints the actual tarball contents, not just the manifest
- `--strict` escalates suggestions to errors — the library-author mode
- Also available as a web tool at publint.dev
