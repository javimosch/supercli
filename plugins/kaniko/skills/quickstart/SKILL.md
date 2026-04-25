---
name: kaniko
description: Use this skill when the user wants to build container images from a dockerfile without root privileges.
---

# Kaniko Plugin

Build container images from a Dockerfile without root privileges.

## Commands

### Operations
- `kaniko image build` — build image via executor
- `kaniko image push` — push image via executor

## Usage Examples
- "kaniko --help"
- "kaniko <args>"

## Installation

```bash
docker run gcr.io/kaniko-project/executor:latest
```

## Examples

```bash
executor --version
executor --help
```

## Key Features
- containers\n- docker\n- build
