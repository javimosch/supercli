---
name: arkade
description: Use this skill when the user wants to install Kubernetes apps, get CLI tools, or set up cloud-native environments quickly.
---

# arkade Plugin

Open Source Marketplace For Kubernetes. The single marketplace for all your Kubernetes and Cloud Native tools. Install CLIs, helm charts, and apps with a single command.

## Commands

### App Installation
- `arkade app install` — Install a Kubernetes app

### Tool Installation
- `arkade tool get` — Get a CLI tool

### Utility
- `arkade _ _` — Passthrough to arkade CLI

## Usage Examples
- "Install Kubernetes app"
- "Get CLI tool"
- "Setup k8s environment"
- "Install cloud-native tools"

## Installation

```bash
brew install arkade
```

## Examples

```bash
# Install app
arkade app install openfaas --namespace openfaas

# Get tool
arkade tool get kubectl

# Get specific version
arkade tool get kubectl --version v1.28.0

# Any arkade command with passthrough
arkade _ _ install openfaas
arkade _ _ get kubectl
arkade _ _ list
```

## Key Features
- **Marketplace** - Cloud-native tools
- **Apps** - Kubernetes apps
- **CLIs** - CLI tools
- **Helm** - Helm charts
- **Fast** - Single command install
- **Curated** - Curated tools
- **K8s** - Kubernetes focused
- **Easy** - Simple interface
- **Extensible** - Add custom tools
- **Community** - Community driven

## Notes
- Great for k8s setup
- Single command installs
- Curated tool collection
- Perfect for dev environments
