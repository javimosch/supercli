---
name: go-template-cli
description: Use this skill when the user wants to render Go text/templates with JSON, YAML, or TOML data.
---

# go-template-cli Plugin

CLI tool for rendering Go text/templates with JSON, YAML, or TOML data context.

## Commands

### File Rendering
- `go-template-cli file render` — Render Go templates with data context

## Usage Examples
- "Render this Go template with JSON data"
- "Use a Go template to generate a Kubernetes manifest"
- "Substitute variables using Go template syntax"

## Installation

```bash
go install github.com/nicm/go-template-cli@latest
```

## Examples

```bash
go-template-cli template.tmpl --data context.json
go-template-cli manifest.tmpl --data values.yaml --output result.yaml
go-template-cli config.tmpl -d key=value
```

## Key Features
- Go text/template syntax support
- JSON, YAML, and TOML data input
- Custom template functions
- Pipeline support
- Kubernetes manifest generation
