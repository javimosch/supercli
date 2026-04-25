---
name: standard
description: Use this skill when the user wants to lint or format JavaScript code with standard.
---

# Standard Plugin

JavaScript style guide, linter, and formatter.

## Commands

### Code Linting
- `standard file lint` — Lint files with standard

## Usage Examples
- "standard file lint --file index.js"
- "standard file lint --file src/ --fix"

## Installation

```bash
npm install -g standard
```

## Examples

```bash
# Lint a file
standard index.js

# Lint directory
standard src/

# Auto-fix problems
standard --fix

# Verbose output
standard --verbose

# Check specific file
standard test.js

# Ignore files via .standardignore
echo "node_modules/" > .standardignore
```

## Key Features
- Zero-configuration linter
- Auto-fix capability
- Consistent JavaScript style
- No config file needed
- Integrates with ESLint
- Supports TypeScript (@standard/ts)
- Fast and reliable
