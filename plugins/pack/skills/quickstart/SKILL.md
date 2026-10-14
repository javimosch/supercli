---
name: pack
description: Use this skill when the user wants to build a container image from application source without writing a Dockerfile — Cloud Native Buildpacks auto-detect the language and produce optimized OCI images.
---

# pack Plugin

`pack` is the CLI for Cloud Native Buildpacks (CNCF). It detects the app language, applies the right buildpacks, and produces a production-grade OCI image — layer caching, SBOM, reproducible builds — all without a Dockerfile.

## Commands

- `pack image build` — Build image from source (`--builder`, `--env`, `--publish`)
- `pack image inspect` — Show image stack, buildpacks, BOM, processes
- `pack image rebase` — Swap run image for patched base, no rebuild
- `pack builder suggest` — List recommended builders
- `pack _ _` — Passthrough to pack CLI (builder create, config, ...)

## Usage Examples

- "Containerize this Node app without a Dockerfile"
- "Rebuild my Go service as an OCI image and push it"
- "Patch the base image of myapp without a full rebuild"

## Installation

```bash
brew install buildpacks/tap/pack
# or download from https://github.com/buildpacks/pack/releases
# needs a running Docker daemon
```

## Examples

```bash
# One-time default builder
pack config default-builder paketobuildpacks/builder-jammy-base

# Build the current directory
pack build myapp --builder paketobuildpacks/builder-jammy-base

# Build + publish to a registry in one shot
pack build registry.example.com/myapp:latest --publish

# Pass env vars and pin a buildpack
pack build myapp --env NODE_ENV=production --buildpack paketo-buildpacks/nodejs
```

## Key Features

- Language detection: Go, Node, Python, Java, Ruby, .NET, PHP, and more
- `pack rebase` applies base-image CVE patches without rebuilding app layers
- Reproducible builds — same source + builder = same image digest
- project.toml for build config; --descriptor for declarative builds
