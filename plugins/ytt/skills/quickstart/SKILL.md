---
name: ytt
description: Use this skill when the user wants to template YAML files, patch Kubernetes configurations, or work with structured YAML templating.
---

# ytt Plugin

YAML templating tool that works on YAML structure instead of text. Template and patch YAML configurations with a powerful overlay mechanism.

## Commands

### Template Rendering
- `ytt template render` — Render YAML templates

### Configuration Patching
- `ytt config patch` — Patch YAML configurations

### Utility
- `ytt _ _` — Passthrough to ytt CLI

## Usage Examples
- "Template YAML files"
- "Patch Kubernetes config"
- "Render YAML templates"
- "Apply YAML overlays"

## Installation

```bash
brew install ytt
```

## Examples

```bash
# Render templates
ytt template render ./templates/

# With data values
ytt template render ./templates/ --data-values-file values.yaml

# Patch configurations
ytt config patch ./base.yaml ./overlay.yaml

# Output as JSON
ytt template render ./templates/ --output json

# Any ytt command with passthrough
ytt _ _ -f ./templates/
ytt _ _ -f ./config.yaml -f ./overlay.yaml
```

## Key Features
- **Structure** - Works on YAML structure
- **Templates** - Powerful templating
- **Overlays** - Overlay mechanism
- **Starlark** - Starlark language
- **Data values** - External data values
- **Functions** - Custom functions
- **Kubernetes** - K8s configs
- **Library** - Reusable libraries
- **Patching** - Config patching
- **Accurate** - Text-safe editing

## Notes
- Part of Carvel suite
- Works on structure not text
- Great for K8s configs
- Supports reusable libraries
