---
name: merge-yaml-cli
description: Use this skill when the user wants to merge YAML files, combine configurations, or merge multiple YAML documents.
---

# merge-yaml-cli Plugin

Node.js CLI utility for merging YAML files. Merge multiple YAML files together using glob patterns.

## Commands

### YAML Merging
- `merge-yaml merge files` — Merge YAML files together

### Utility
- `merge-yaml _ _` — Passthrough to merge-yaml CLI

## Usage Examples
- "Merge these YAML files"
- "Combine configurations"
- "Merge YAML with glob pattern"
- "Merge multiple config files"

## Installation

```bash
npm install -g merge-yaml-cli
```

## Examples

```bash
# Merge single file
merge-yaml merge files -i config.yaml -o merged.yaml

# Merge with glob pattern
merge-yaml merge files -i "configs/*.yml" -o merged.yml

# Merge includes directory
merge-yaml merge files -i example.yaml includes/*.yml -o merged.yml

# Any merge-yaml command with passthrough
merge-yaml _ _ -i "configs/*.yml" -o output.yml
merge-yaml _ _ -i base.yaml override.yaml -o merged.yaml
```

## Key Features
- **Glob patterns** - Match multiple files
- **Deep merge** - Merges nested structures
- **Override** - Later files override earlier ones
- **CLI and API** - Use from command line or code
- **Simple** - Easy to use
- **Flexible** - Works with any YAML structure
- **Configuration** - Great for config management
- **Cross-platform** - Works everywhere

## Merge Behavior
- Files are merged in order
- Later files override earlier ones
- Nested structures are deep merged
- Arrays are replaced (not merged)
- Comments are preserved from last file

## Notes
- Last file takes precedence for conflicts
- Great for environment-specific configs
- Can be used in build processes
- Supports standard YAML syntax
