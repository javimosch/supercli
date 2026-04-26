---
name: nexus-cli
description: Use this skill when the user wants to nexus cli for docker registry v2 management.
---

# Nexus-cli Plugin

Nexus CLI for Docker Registry v2 management.

## Commands

### Operations
- `nexus-cli image list` — list image via nexus
- `nexus-cli image delete` — delete image via nexus
- `nexus-cli repository list` — list repository via nexus
- `nexus-cli repository create` — create repository via nexus
- `nexus-cli blobstore list` — list blobstore via nexus
- `nexus-cli task list` — list task via nexus

## Usage Examples
- "nexus-cli --help"
- "nexus-cli <args>"

## Installation

```bash
go install github.com/mlabouardy/nexus-cli@latest
```

## Examples

```bash
nexus --version
nexus --help
```

## Key Features
- nexus\n- docker-registry\n- artifacts
