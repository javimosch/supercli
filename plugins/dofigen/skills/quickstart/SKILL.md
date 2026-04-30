---
name: dofigen
description: Use this skill when the user wants to generate Dockerfiles or build Docker/OCI images from a declarative YAML configuration.
---

# dofigen Plugin

Generate Dockerfiles and OCI images from YAML configuration.

## Commands

### Dockerfile
- `dofigen dockerfile generate` — Generate a Dockerfile from dofigen configuration

### Image
- `dofigen image build` — Build a Docker/OCI image from dofigen configuration

## Usage Examples
- "Generate a Dockerfile from dofigen.yml"
- "Build a container image with dofigen"
- "Create a Docker configuration file"

## Installation

```bash
cargo install dofigen
```

## Examples

```bash
# Generate Dockerfile from dofigen.yml
dofigen generate

# Generate to a specific file
dofigen generate -o Dockerfile

# Build the image directly
dofigen build

# Build with a specific config file
dofigen build --config myapp.yml
```

## Key Features
- Declarative container image builds via YAML
- Dockerfile generation
- Direct OCI image building
- Multi-stage build support
- Optimized layer caching
