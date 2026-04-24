---
name: devspace
description: Use this skill when the user wants to develop applications in Kubernetes, deploy to k8s, or build cloud-native software with hot reloading.
---

# devspace Plugin

DevSpace is an open-source developer tool for Kubernetes that lets you develop and deploy cloud-native software faster. Build, test, and debug applications directly inside Kubernetes.

## Commands

### Development
- `devspace dev start` — Start development in Kubernetes

### Deployment
- `devspace deploy run` — Deploy to Kubernetes

### Utility
- `devspace _ _` — Passthrough to devspace CLI

## Usage Examples
- "Develop in Kubernetes"
- "Deploy to k8s"
- "Start devspace"
- "Kubernetes development"

## Installation

```bash
brew install devspace
```

Requires kubectl and a Kubernetes cluster.

## Examples

```bash
# Start development
/devspace dev start

# With namespace
devspace dev start --namespace myapp

# Deploy application
devspace deploy run

# Deploy with profile
devspace deploy run --profile production

# Any devspace command with passthrough
devspace _ _ dev
devspace _ _ deploy
devspace _ _ logs
```

## Key Features
- **Hot reload** - Automatic reloading
- **Debugging** - Debug in Kubernetes
- **Sync** - File synchronization
- **Build** - Image building
- **Deploy** - Easy deployment
- **Logs** - Stream logs
- **Terminal** - Container terminal
- **Port-forward** - Port forwarding
- **Profiles** - Multiple profiles
- **CI/CD** - Pipeline integration

## Notes
- Requires Kubernetes cluster
- Great for cloud-native dev
- Supports hot reloading
- Perfect for k8s workflows
