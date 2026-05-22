---
name: depcheck
description: Use this skill when the user wants to find unused or missing dependencies in a Node.js project — clean up package.json and keep dependencies lean.
---

# depcheck Plugin

depcheck scans Node.js projects to identify unused dependencies, missing packages, and dev/prod misclassification. Supports multiple file types including JSX, TSX, and ES modules.

## Commands

- `depcheck _ _ <args>` — Passthrough

## Usage Examples

- "check for unused dependencies in this project"
- "find missing packages in package.json"
- "list unused devDependencies"
- "ignore specific packages when checking"

## Installation

```bash
npm install -g depcheck
```

## Key Features
- Unused dependency detection
- Missing dependency identification
- Dev vs production dependency analysis
- JSX, TSX, ES module support
- Custom parser plugins
- JSON output for CI integration
- Monorepo support
- Configurable ignore patterns
