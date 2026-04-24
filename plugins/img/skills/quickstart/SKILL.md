---
name: img
description: Use this skill when the user wants to build container images without Docker daemon, run unprivileged builds, or build images in CI/CD environments.
---

# img Plugin

Standalone, daemon-less, unprivileged container image builder. Build container images without Docker daemon or root privileges.

## Commands

### Image Building
- `img image build` — Build a container image

### Utility
- `img _ _` — Passthrough to img CLI

## Usage Examples
- "Build container image"
- "Dockerless image build"
- "Unprivileged image build"
- "Build image without Docker"

## Installation

```bash
brew install img
```

Or via Go:
```bash
go install github.com/genuinetools/img@latest
```

## Examples

```bash
# Build image
img image build --tag myapp:latest .

# Build with specific Dockerfile
img image build --tag myapp:latest --file Dockerfile.prod .

# No cache build
img image build --tag myapp:latest --no-cache .

# Any img command with passthrough
img _ _ build --tag myapp:latest .
img _ _ ls
img _ _ pull alpine:latest
```

## Key Features
- **Daemon-less** - No Docker daemon
- **Unprivileged** - No root needed
- **Secure** - User namespace isolation
- **OCI** - OCI compliant images
- **Dockerfile** - Standard Dockerfile support
- **Cache** - Layer caching
- **Lightweight** - Minimal footprint
- **Fast** - Quick builds
- **CI/CD** - Pipeline friendly
- **Compatible** - Docker compatible

## Notes
- No Docker daemon required
- Runs without root privileges
- Great for CI/CD pipelines
- OCI image compatible
