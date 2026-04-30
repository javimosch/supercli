---
name: bluebuild
description: Use this skill when the user wants to build custom Fedora Atomic images, generate Containerfiles, or create recipe templates.
---

# BlueBuild Plugin

Build custom Fedora Atomic images based on recipe.yml.

## Commands

### Image
- `bluebuild image build` — Build a custom image from recipe.yml
- `bluebuild image generate` — Generate a Containerfile from recipe.yml

### Template
- `bluebuild template new` — Generate a new recipe template

## Usage Examples
- "Build a Fedora Atomic image"
- "Generate a Containerfile from my recipe"
- "Create a new BlueBuild recipe template"

## Installation

```bash
cargo install bluebuild
```

## Examples

```bash
# Build image from recipe.yml
bluebuild build

# Generate Containerfile
bluebuild generate

# Create new template
bluebuild template
```

## Key Features
- Custom Fedora Atomic image builds
- Recipe-driven configuration via YAML
- Support for Docker, Podman, and Buildah
- Template generation for quick starts
