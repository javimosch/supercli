---
name: apko
description: Use this skill when the user wants to build a minimal OCI container image declaratively from APK packages, or inspect/lock an apko.yaml config.
---

# apko Plugin

apko builds OCI images from a YAML manifest listing APK packages — no Dockerfile, no base image required. Produces reproducible multi-arch images with automatic SBOMs; works with Alpine, Wolfi, and Chainguard repositories.

## Commands

### Build
- `apko image build` — `apko build <config.yaml> <tag> <output.tar>` (then `docker load`)
- `apko image publish` — Build and push straight to a registry

### Config
- `apko config show` — Parse and print the resolved config
- `apko lock generate` — Write apko.lock.json pinning exact packages

### Other
- `apko _ _` — Passthrough (`apko show-packages`, `apko resolve`, `apko build-minirootfs`)

## Usage Examples

- "Build an OCI image from this apko.yaml into image.tar"
- "Show the resolved apko config for debugging"
- "Generate a lockfile so builds are bit-for-bit reproducible"

## Installation

```bash
go install chainguard.dev/apko@latest
# or: brew install apko
# or: mise use -g apko@latest
```

## Examples

```bash
apko build examples/alpine-base.yaml apko-example:latest output.tar
docker load < output.tar
apko build apko.yaml ghcr.io/org/app:v1 out.tar && apko publish apko.yaml ghcr.io/org/app:v1
apko show-config apko.yaml
apko lock apko.yaml --output apko.lock.json
```

## Key Features

- Single YAML declares contents, entrypoint, users, env, archs
- `--build-arch`/`--arch` for multi-arch manifests
- Built-in SBOMs (SPDX + CycloneDX) per arch
- Lockfile + `--locked` for reproducible rebuilds
- No daemon needed — emits OCI tarballs; pairs with `docker load`, `skopeo`, or `crane`
