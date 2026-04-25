---
name: kubecm
description: Use this skill when the user wants to switch Kubernetes contexts, manage kubeconfig files, or work with multiple Kubernetes clusters.
---

# kubecm Plugin

A Kubeconfig manager for multiple Kubernetes clusters. Switch and manage kubeconfig files easily from the command line.

## Commands

### Context Management
- `kubecm context list` — List Kubernetes contexts
- `kubecm context switch` — Switch Kubernetes context

### Utility
- `kubecm _ _` — Passthrough to kubecm CLI

## Usage Examples
- "List Kubernetes contexts"
- "Switch K8s context"
- "Manage kubeconfig"
- "Merge kubeconfig files"

## Installation

```bash
brew install kubecm
```

Or via Go:
```bash
go install github.com/sunny0826/kubecm/cmd/kubecm@latest
```

## Examples

```bash
# List contexts
kubecm ls

# Switch context
kubecm sw my-cluster

# List with kubeconfig
kubecm ls --kubeconfig ~/.kube/config

# Any kubecm command with passthrough
kubecm _ _ ls
kubecm _ _ sw production
kubecm _ _ add ~/.kube/config-new
```

## Key Features
- **Contexts** - Context management
- **Switch** - Context switching
- **Merge** - Kubeconfig merging
- **Multi-cluster** - Multi-cluster support
- **Interactive** - Interactive selection
- **K8s** - Kubernetes integration
- **DevOps** - DevOps workflows
- **Config** - Config management
- **CLI** - Command line native
- **Easy** - Easy to use

## Notes
- Requires kubectl
- Great for multi-cluster setups
- Supports kubeconfig merging
- Interactive context selection
