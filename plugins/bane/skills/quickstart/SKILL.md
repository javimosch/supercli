---
name: bane
description: Use this skill when the user wants to generate AppArmor profiles for Docker containers, secure Docker containers, or create container security policies.
---

# bane Plugin

Custom & better AppArmor profile generator for Docker containers. Generate security profiles for Docker containers automatically.

## Commands

### Profile Generation
- `bane profile generate` — Generate AppArmor profile for container

### Utility
- `bane _ _` — Passthrough to bane CLI

## Usage Examples
- "Generate AppArmor profile"
- "Secure Docker container"
- "Create security profile"
- "Container hardening"

## Installation

```bash
brew install bane
```

Or via Go:
```bash
go install github.com/genuinetools/bane@latest
```

## Examples

```bash
# Generate profile for image
bane profile generate nginx:latest

# Specify profile name
bane profile generate nginx:latest --profile nginx-profile

# Output to file
bane profile generate nginx:latest --output profile.apparmor

# Dry run
bane profile generate nginx:latest --dry-run

# Any bane command with passthrough
bane _ _ nginx:latest
bane _ _ nginx:latest --profile myprofile
```

## Key Features
- **AppArmor** - AppArmor profile generation
- **Docker** - Docker container security
- **Automatic** - Automatic profile creation
- **Secure** - Container hardening
- **Custom** - Customizable profiles
- **Analysis** - Behavior analysis
- **Policies** - Security policies
- **Easy** - Simple interface
- **Integration** - Docker integration
- **Safety** - Improved container security

## Notes
- Great for container security
- Analyzes container behavior
- Creates appropriate profiles
- Perfect for production containers
