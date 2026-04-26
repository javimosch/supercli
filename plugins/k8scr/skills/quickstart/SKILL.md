---
name: k8scr
description: Use this skill when the user wants to push and pull oci images to/from kubernetes clusters.
---

# K8scr Plugin

Push and pull OCI images to/from Kubernetes clusters.

## Commands

### Operations
- `k8scr image push` — push image via k8scr
- `k8scr image pull` — pull image via k8scr
- `k8scr image list` — list image via k8scr

## Usage Examples
- "k8scr --help"
- "k8scr <args>"

## Installation

```bash
go install github.com/hasheddan/k8scr@latest
```

## Examples

```bash
k8scr --version
k8scr --help
```

## Key Features
- kubernetes\n- oci\n- images
