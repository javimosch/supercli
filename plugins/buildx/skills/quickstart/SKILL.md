---
name: buildx
description: Use this skill when the user wants to build Docker images with extended capabilities
---

# Buildx Plugin

build Docker images with extended capabilities

## Commands
- `buildx self version` — Print buildx version
- `buildx _ _` — Passthrough to docker-buildx CLI

## Usage Examples
- "Build multi-platform Docker image"
- "Use build cache effectively"
- "Build with BuildKit features"

## Installation

```bash
Docker CLI plugin (included with Docker Desktop)
```

## Examples
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t myimage .
docker buildx create --use --name mybuilder
docker buildx build --push -t registry/myimage:latest .
```

## Key Features
- Multi-platform builds
- Advanced BuildKit features
- Build cache management
- Remote builder support
