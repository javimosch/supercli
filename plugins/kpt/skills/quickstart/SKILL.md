---
name: kpt
description: Use this skill when the user wants to manage Kubernetes packages, apply KPT configurations, or customize and deploy Kubernetes resources.
---

# kpt Plugin

Google's tool for managing Kubernetes packages. Package, customize, and apply Kubernetes configurations using a standard format.

## Commands

### Package Management
- `kpt pkg get` — Get a Kubernetes package
- `kpt pkg apply` — Apply package to cluster

### Utility
- `kpt _ _` — Passthrough to kpt CLI

## Usage Examples
- "Get Kubernetes package"
- "Apply package to cluster"
- "Manage k8s packages"
- "Deploy kpt package"

## Installation

```bash
brew install kpt
```

## Examples

```bash
# Get package
kpt pkg get https://github.com/GoogleContainerTools/kpt.git/package-examples/helloworld-set@v0.7.0 ./my-package

# Apply package
kpt pkg apply ./my-package

# With timeout
kpt pkg apply ./my-package --reconcile-timeout 10m

# Any kpt command with passthrough
kpt _ _ pkg get https://github.com/... ./pkg
kpt _ _ live apply ./pkg
kpt _ _ fn render ./pkg
```

## Key Features
- **Packages** - K8s package management
- **Functions** - Config functions
- **Live apply** - Server-side apply
- **Git** - Git-based packages
- **Custom** - Customization
- **Reconcile** - Reconciliation
- **Resources** - Resource management
- **Hydration** - Config hydration
- **Validation** - Config validation
- **CI/CD** - Pipeline friendly

## Notes
- Requires kubectl configured
- Uses Kptfile for metadata
- Supports Git-based packages
- Great for k8s config management
