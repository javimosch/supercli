---
name: prettier
description: Use this skill when the user wants to format code with prettier.
---

# Prettier Plugin

Code formatter using prettier. Opinionated code formatter for JavaScript, TypeScript, CSS, HTML, JSON, and more.

## Commands

### Code Formatting
- `prettier file format` — Format file with prettier
- `prettier file check` — Check if files are formatted

## Usage Examples
- "prettier file format --file index.js"
- "prettier file check --file src/"
- "prettier file format --file index.js --single_quote"

## Installation

```bash
npm install -g prettier
```

## Examples

```bash
# Format a file
prettier --write index.js

# Format entire directory
prettier --write src/

# Check if files are formatted
prettier --check src/

# Format with single quotes
prettier --write --single-quote index.js

# Format with trailing commas
prettier --write --trailing-comma all index.js

# Format JSON
prettier --write package.json

# Check formatting
prettier --check src/
```

## Key Features
- Opinionated code formatting
- Supports multiple languages (JS, TS, CSS, HTML, JSON, Markdown)
- Configurable via .prettierrc
- Check mode for CI/CD
- Consistent code style across projects
