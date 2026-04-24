---
name: mirrord
description: Use this skill when the user wants to run local code in cloud environments, debug cloud services locally, or connect to Kubernetes.
---

# mirrord Plugin

Connect your local process and your cloud environment. Run local code in cloud conditions for debugging and development.

## Commands

### Process Execution
- `mirrord process run` — Run process with mirrord

### Utility
- `mirrord _ _` — Passthrough to mirrord CLI

## Usage Examples
- "Run local code in cloud"
- "Debug Kubernetes service locally"
- "Connect to cloud environment"
- "Load cloud environment variables"

## Installation

```bash
brew install mirrord
```

Or via Cargo:
```bash
cargo install mirrord
```

## Examples

```bash
# Run command with mirrord
mirrord process run --target deployment/name

# Set Kubernetes namespace
mirrord process run --target deployment/name --namespace my-namespace

# Set Kubernetes context
mirrord process run --target deployment/name --context my-context

# Load environment variables
mirrord process run --target deployment/name --env

# Run specific command
mirrord process run --target deployment/name npm start

# Any mirrord command with passthrough
mirrord _ _ --target deployment/name --env
mirrord _ _ exec --target pod/name
```

## Key Features
- **Cloud context** - Run code in cloud environment
- **Network interception** - Intercept network traffic
- **File system** - Access cloud file system
- **Environment variables** - Load cloud env vars
- **Kubernetes** - Works with Kubernetes clusters
- **Debugging** - Debug cloud services locally
- **VS Code** - VS Code extension available
- **IntelliJ** - IntelliJ plugin available
- **Cross-platform** - Linux, macOS, Windows
- **Fast** - Low overhead

## Notes
- Requires Kubernetes cluster access
- Can intercept network traffic
- Great for debugging cloud services
- Works with popular IDEs
- Supports multiple cloud providers
