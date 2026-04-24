---
name: cup
description: Use this skill when the user wants to check for container image updates, monitor Docker registries for outdated images, or automate image update notifications.
---

# cup Plugin

Check for available updates for your container images. Monitor and report outdated container images in registries and local deployments.

## Commands

### Image Update Checking
- `cup image check` — Check for image updates

### Utility
- `cup _ _` — Passthrough to cup CLI

## Usage Examples
- "Check image updates"
- "Monitor container versions"
- "Check for outdated images"
- "Container update checker"

## Installation

```bash
brew install sergi0g/tap/cup
```

Or via Cargo:
```bash
cargo install cup
```

## Examples

```bash
# Check specific image
cup image check nginx:latest

# Check all configured images
cup image check --all

# Output as JSON
cup image check --all --json

# Any cup command with passthrough
cup _ _ check nginx:latest
cup _ _ check --all --json
cup _ _ list
```

## Key Features
- **Updates** - Check for updates
- **Registries** - Multi-registry support
- **Docker Hub** - Docker Hub support
- **GHCR** - GitHub Container Registry
- **JSON** - JSON output
- **Config** - Config file support
- **Monitoring** - Update monitoring
- **Fast** - Fast checking
- **CI/CD** - Pipeline integration
- **Notifications** - Update notifications

## Notes
- Supports multiple registries
- Great for CI update checks
- Configurable via config file
- Perfect for image lifecycle management
