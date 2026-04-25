---
name: fx
description: Use this skill when the user wants to view, filter, or process JSON data, transform JSON structures, or work with JSON in the terminal.
---

# fx Plugin

Terminal JSON viewer and processor. View, filter, and transform JSON data with a powerful query language.

## Commands

### JSON Processing
- `fx view json` — View and process JSON data

### Utility
- `fx _ _` — Passthrough to fx CLI

## Usage Examples
- "View this JSON file"
- "Filter JSON data"
- "Transform this JSON"
- "Process JSON from curl"

## Installation

```bash
brew install fx
```

Or via npm:
```bash
npm install -g fx
```

Or via Go:
```bash
go install github.com/antonmedv/fx@latest
```

## Examples

```bash
# View JSON file
fx view json data.json

# View JSON from stdin
curl -s https://api.example.com/data | fx

# Filter JSON
cat data.json | fx '.items[] | select(.id > 10)'

# Transform JSON
cat data.json | fx '.[] | {name, value}'

# Interactive mode
fx data.json

# Print specific field
cat data.json | fx '.name'

# Array operations
cat data.json | fx '.[] | .name'

# Complex queries
cat data.json | fx '.users[] | select(.age > 18)'

# Any fx command with passthrough
fx _ _ data.json
fx _ _ -r 'x * 2' < data.json
```

## Key Features
- **Interactive mode** - Browse JSON with keyboard navigation
- **Query language** - Powerful filtering and transformation
- **Pipe support** - Process JSON from stdin
- **File support** - Read JSON from files
- **Color output** - Syntax-highlighted JSON
- **Compact output** - Minified JSON option
- **Scripting** - Non-interactive mode for scripts

## Notes
- Can be used interactively or in scripts
- Supports JavaScript-like query syntax
- Works with any JSON data
- Can output in various formats
- Great for API response inspection
