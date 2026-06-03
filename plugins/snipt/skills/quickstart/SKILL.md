---
name: snipt
description: Use this skill when the user wants to expand text snippets and templates
---

# Snipt Plugin

expand text snippets and templates

## Commands
- `snipt self version` — Print snipt version
- `snipt _ _` — Passthrough to snipt CLI

## Usage Examples
- "Expand a code snippet"
- "Use a text template"
- "Manage snippet library"

## Installation

```bash
cargo install snipt
```

## Examples
```bash
snipt expand "pyclass"
snipt list --lang python
snipt add --name "pyclass" --template "class {{name}}:\\n    pass"
```

## Key Features
- Snippet expansion engine
- Template variables
- Snippet library management
- Multi-language support
