---
name: kapp
description: Use this skill when the user wants to deploy applications to Kubernetes, manage K8s deployments, or work with Carvel tools.
---

# kapp Plugin

A lightweight application deployment tool for Kubernetes. Deploy and manage Kubernetes applications with simple, declarative configuration.

## Commands

### Application Deployment
- `kapp app deploy` — Deploy application to Kubernetes
- `kapp app list` — List deployed applications
- `kapp app delete` — Delete application from Kubernetes

### Utility
- `kapp _ _` — Passthrough to kapp CLI

## Usage Examples
- "Deploy app to Kubernetes"
- "List K8s applications"
- "Delete K8s deployment"
- "Manage Kubernetes apps"

## Installation

```bash
brew install kapp
```

Or via Go:
```bash
go install github.com/carvel-dev/kapp/cmd/kapp@latest
```

## Examples

```bash
# Deploy application
kapp deploy -f config.yaml -a myapp

# Deploy with namespace
kapp deploy -f config.yaml -a myapp -n production

# Deploy with diff
kapp deploy -f config.yaml -a myapp --diff-run

# List applications
kapp ls

# List in namespace
kapp ls -n production

# Delete application
kapp delete -a myapp

# Any kapp command with passthrough
kapp _ _ deploy -f config.yaml
kapp _ _ ls --all-namespaces
kapp _ _ delete -a myapp -n production
```

## Key Features
- **Deploy** - Application deployment
- **Manage** - Application management
- **Diff** - Change preview
- **Simple** - Simple YAML config
- **Lightweight** - Lightweight tool
- **K8s** - Kubernetes native
- **Declarative** - Declarative config
- **Fast** - Fast deployment
- **Carvel** - Carvel suite
- **DevOps** - DevOps workflows

## Notes
- Part of Carvel suite
- Simple YAML configuration
- Shows deployment diffs
- Great for GitOps workflows
