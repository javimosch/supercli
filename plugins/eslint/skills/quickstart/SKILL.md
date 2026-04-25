---
name: eslint
description: Use this skill when the user wants to lint JavaScript/TypeScript code with eslint.
---

# ESLint Plugin

Find and fix problems in JavaScript and TypeScript code.

## Commands

### Code Linting
- `eslint file lint` — Lint files with eslint

## Usage Examples
- "eslint file lint --file index.js"
- "eslint file lint --file src/ --fix"

## Installation

```bash
npm install -g eslint
```

## Examples

```bash
# Lint a file
eslint index.js

# Lint directory
eslint src/

# Auto-fix problems
eslint --fix index.js

# Output as JSON
eslint --format json index.js

# Use specific config
eslint --config .eslintrc.json index.js

# Ignore patterns
eslint --ignore-pattern node_modules/ src/

# Check TypeScript files
eslint --ext .ts,.tsx src/
```

## Key Features
- Highly configurable linter
- Auto-fix capability
- JavaScript and TypeScript support
- JSON output format
- Customizable rules
- Plugin ecosystem
- Integrates with editors
