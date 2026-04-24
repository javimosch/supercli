---
name: kubecolor
description: Use this skill when the user wants to colorize kubectl output, make Kubernetes command output more readable, or add syntax highlighting to kubectl results.
---

# kubecolor Plugin

Colorize your kubectl output. A kubectl wrapper that adds syntax highlighting and color coding to Kubernetes command output for better readability.

## Commands

### Kubernetes Operations
- `kubecolor k8s run` — Run kubectl command with colorized output

### Utility
- `kubecolor _ _` — Passthrough to kubecolor CLI

## Usage Examples
- "Colorize kubectl output"
- "Pretty print kubernetes resources"
- "Colored kubectl pods list"
- "Highlight kubernetes output"

## Installation

```bash
brew install kubecolor
```

Requires kubectl to be installed.

## Examples

```bash
# Get pods with colors
kubecolor k8s run get pods

# Describe a deployment
kubecolor k8s run describe deployment my-app

# Get nodes with colors
kubecolor k8s run get nodes

# Any kubectl command with colors
kubecolor _ _ get pods --all-namespaces
kubecolor _ _ logs my-pod
```

## Key Features
- **Colorize** - Syntax highlighting
- **kubectl** - kubectl wrapper
- **Themes** - Dark/light themes
- **Readable** - Better readability
- **Compatible** - kubectl compatible
- **Fast** - Minimal overhead
- **Config** - Configurable colors
- **Output** - Formatted output
- **Logs** - Colored logs
- **YAML** - Colored YAML

## Notes
- Requires kubectl installed
- Drop-in kubectl replacement
- Great for terminal readability
- Supports theme configuration
