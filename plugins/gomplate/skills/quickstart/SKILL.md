---
name: gomplate
description: Use this skill when the user wants to render templates, generate config files, or use Go templates with data from various sources.
---

# gomplate Plugin

A flexible commandline tool for template rendering. Supports lots of local and remote datasources. Render templates with data from various sources.

## Commands

### Template Rendering
- `gomplate template render` — Render template with data

### Utility
- `gomplate _ _` — Passthrough to gomplate CLI

## Usage Examples
- "Render template file"
- "Generate config from template"
- "Use Go templates"
- "Render with data source"

## Installation

```bash
brew install gomplate
```

Or via Go:
```bash
go install github.com/hairyhenderson/gomplate/v4/cmd/gomplate@latest
```

## Examples

```bash
# Render template
gomplate template render template.tpl

# Render with data source
gomplate template render template.tpl --data data.yaml

# Output to file
gomplate template render template.tpl --out output.txt

# Add context data
gomplate template render template.tpl --context key=value

# Any gomplate command with passthrough
gomplate _ _ template.tpl --data data.yaml
gomplate _ _ --in template.tpl --out result.txt
```

## Key Features
- **Go templates** - Full Go template support
- **Data sources** - Local and remote datasources
- **Consul** - Consul KV integration
- **Vault** - Vault secret integration
- **HTTP** - HTTP data sources
- **File** - Local file data
- **Environment** - Environment variables
- **AWS** - AWS datasource support
- **Flexible** - Configurable rendering
- **Fast** - Efficient template processing

## Notes
- Uses Go template syntax
- Supports many datasources
- Great for config generation
- Works in CI/CD pipelines
