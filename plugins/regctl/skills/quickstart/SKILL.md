---
name: regctl
description: Use this skill when the user wants to inspect container images, copy images between registries, list image tags, or get image digests without pulling images locally.
---

# regctl Plugin

OCI/Docker registry client for inspecting, copying, and managing container images.

## Commands

### Image
- `regctl image inspect` — Inspect container image manifest
- `regctl image copy` — Copy container image between registries
- `regctl image digest` — Get image digest

### Tags
- `regctl tag list` — List tags for a repository

## Usage Examples
- "Inspect the manifest of alpine:latest"
- "Copy an image from Docker Hub to my private registry"
- "List all tags in a repository"
- "Get the digest of an image"

## Installation

```bash
brew install regctl
```

## Examples

```bash
# Inspect image
regctl image inspect alpine:latest

# Get digest
regctl image digest alpine:latest

# Copy image
regctl image copy alpine:latest myreg.io/alpine:latest

# List tags
regctl tag list library/alpine

# Set custom registry
regctl registry set myreg.io --user user --pass pass
```
