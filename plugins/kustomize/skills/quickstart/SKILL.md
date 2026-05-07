---
name: kustomize
description: Use this skill when the user wants to customize Kubernetes configurations, manage K8s YAML with overlays, patch resources, or build kustomizations for different environments.
---

# kustomize Plugin

Kubernetes configuration customization tool.

## Commands

### Build
- `kustomize build run` — Build kustomization to produce Kubernetes resources
- `kustomize build output` — Build and write output to file

### Edit
- `kustomize edit add-resource` — Add a resource to kustomization.yaml

## Usage Examples
- "Build Kubernetes resources from kustomization"
- "Add a resource to kustomization.yaml"
- "Generate K8s YAML for production overlay"

## Installation

```bash
brew install kustomize
```

## Examples

```bash
# Build kustomization
kustomize build .

# Build with overlay
kustomize build overlays/production

# Output to file
kustomize build . -o output.yaml

# Add resource
kustomize edit add resource deployment.yaml

# Add label transformer
kustomize edit add label app:myapp
```
