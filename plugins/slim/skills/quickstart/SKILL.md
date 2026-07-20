---
name: slim
description: Use this skill when the user wants to shrink Docker images, analyze container layers, lint Dockerfiles, or debug running containers — Docker Slim toolkit for security and size optimization.
---

# slim Plugin

DockerSlim (slimtoolkit/slim) minifies container images by removing unused files, analyzes image layers, lints Dockerfiles, and attaches debug shells to running containers. CNCF sandbox project.

## Installation

```bash
brew install docker-slim
# or
curl -sL https://raw.githubusercontent.com/slimtoolkit/slim/master/scripts/install-slim.sh | sudo -E bash -
```

## Basic Usage

```bash
# Optimize an image (creates a smaller variant)
slim build myapp:latest

# Static analysis of layers and files
slim xray myapp:latest

# Lint a Dockerfile
slim lint Dockerfile

# Debug a running container
slim debug <container-id>
```

## Common Flags

```bash
# Custom tag for optimized image
slim build myapp:latest --tag myapp:slim

# Include extra paths in the minified image
slim build myapp:latest --include-path /app/config

# Show layer change details
slim xray myapp:latest --changes all
```

## Usage Examples

- "Shrink this Docker image for production"
- "Analyze what's inside this container image"
- "Lint my Dockerfile for best practices"
- "Debug a running container interactively"

## SuperCLI

```bash
sc slim image build myapp:latest
sc slim image xray myapp:latest
sc slim dockerfile lint Dockerfile
sc plugins learn slim
```
