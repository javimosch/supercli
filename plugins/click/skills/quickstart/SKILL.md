---
name: click
description: Use this skill when the user wants an interactive Kubernetes CLI, a user-friendly kubectl alternative, or simplified Kubernetes operations from the command line.
---

# click Plugin

Command Line Interactive Controller for Kubernetes. An interactive Kubernetes CLI that provides a more user-friendly interface for kubectl operations.

## Commands

### Kubernetes Operations
- `click k8s run` — Run click interactive Kubernetes CLI

### Utility
- `click _ _` — Passthrough to click CLI

## Usage Examples
- "Run interactive k8s CLI"
- "User-friendly kubectl"
- "Simplified Kubernetes"
- "Interactive Kubernetes shell"

## Installation

```bash
brew install click
```

Or via Cargo:
```bash
cargo install click
```

Requires kubectl and a Kubernetes cluster configured.

## Examples

```bash
# Run interactive CLI
click k8s run

# With specific namespace
click k8s run --namespace my-app

# With specific context
click k8s run --context production

# Any click command with passthrough
click _ _ --namespace my-app
click _ _ --context staging
```

## Key Features
- **Interactive** - Interactive shell
- **Tab completion** - Auto-completion
- **Context** - Easy context switching
- **Namespace** - Namespace management
- **Pods** - Pod operations
- **Logs** - Log viewing
- **Exec** - Container execution
- **Describe** - Resource descriptions
- **Simplified** - Simplified commands
- **kubectl** - kubectl alternative

## Notes
- Requires kubectl configured
- Great for daily k8s operations
- Easier than raw kubectl
- Perfect for Kubernetes management
