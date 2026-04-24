---
name: reg
description: Use this skill when the user wants to inspect Docker registry images, list repository tags, or manage Docker registries without pulling images.
---

# reg Plugin

Docker registry CLI. List, inspect, and manage Docker registry images and tags from the command line without pulling.

## Commands

### Image Operations
- `reg image list` — List images in registry
- `reg image inspect` — Inspect image manifest

### Utility
- `reg _ _` — Passthrough to reg CLI

## Usage Examples
- "List registry images"
- "Inspect image manifest"
- "Check Docker registry tags"
- "List repository images"

## Installation

```bash
brew install reg
```

Or via Go:
```bash
go install github.com/genuinetools/reg@latest
```

## Examples

```bash
# List images in registry
reg image list r.j3ss.co

# With authentication
reg image list myregistry.com --username user --password pass

# Inspect image manifest
reg image inspect r.j3ss.co/img:latest

# List tags for image
reg image list r.j3ss.co/img

# Any reg command with passthrough
reg _ _ ls r.j3ss.co
reg _ _ manifest r.j3ss.co/img:latest
reg _ _ vulns r.j3ss.co/img:latest
```

## Key Features
- **No pull** - No image pulling needed
- **List** - List repositories and tags
- **Inspect** - Inspect manifests
- **Vulns** - Vulnerability scanning
- **Delete** - Delete tags
- **History** - Show layer history
- **Registry** - Multi-registry support
- **Auth** - Authentication support
- **Docker Hub** - Docker Hub support
- **Fast** - Quick operations

## Notes
- Works without Docker daemon
- Supports private registries
- Great for registry automation
- Can analyze image layers
