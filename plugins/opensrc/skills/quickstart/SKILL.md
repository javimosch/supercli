---
name: opensrc
description: Use this skill when the user wants to fetch or access source code for npm, PyPI, or crates.io packages for AI coding agent context.
---

# Opensrc Plugin

Fetch source code for npm packages to give AI coding agents deeper context.

## Commands

### Package Operations
- `opensrc package path` — Get cached path to package source
- `opensrc package fetch` — Fetch package source to cache

## Usage Examples

Get path to package source:
```
opensrc path zod
rg "parse" $(opensrc path zod)
cat $(opensrc path zod)/src/types.ts
```

Fetch from different registries:
```
opensrc path pypi:requests
opensrc path crates:tokio
```

Search package source:
```
find $(opensrc path zod) -name "*.ts"
rg "function" $(opensrc path lodash)
```

## Installation

```bash
npm install -g opensrc
```

Or via Rust:
```bash
cargo install opensrc-cli
```

## Supported Registries
- npm (default)
- PyPI (prefix: `pypi:`)
- crates.io (prefix: `crates:`)
- GitHub (any public repo)

## Key Features
- Fetches and caches package source code
- Works with any registry (npm, PyPI, crates.io, GitHub)
- CLI tool for AI coding agents
- Fast path lookup after first fetch
- Open source (Apache-2.0)