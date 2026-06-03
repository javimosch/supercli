---
name: tera-cli
description: Use this skill when the user wants to render Tera templates (Jinja2-like) from the command line.
---

# tera-cli Plugin

CLI for the Tera templating engine. Supports Jinja2-like template syntax with filters, loops, conditions, and inheritance.

## Commands

### Template Rendering
- `tera-cli template render` — Render a Tera template with context data

## Usage Examples
- "Render this Tera template with JSON data"
- "Use this Jinja2-style template to generate a config"
- "Substitute variables in a template file"

## Installation

```bash
cargo install tera-cli
```

## Examples

```bash
tera template.txt --context data.json
tera template.txt --context-file data.json --output result.txt
tera template.txt -s key=value
```

## Key Features
- Jinja2-like template syntax
- Filter support (length, upper, lower, etc.)
- Loop and conditional rendering
- Template inheritance
- JSON context input
- Fast Rust implementation
