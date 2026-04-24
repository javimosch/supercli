---
name: cloudlist
description: Use this skill when the user wants to enumerate cloud assets, list resources from cloud providers, or perform cloud asset discovery.
---

# cloudlist Plugin

Cloudlist is a tool for listing Assets from multiple Cloud Providers. Enumerate cloud assets across AWS, GCP, Azure, and more.

## Commands

### Asset Enumeration
- `cloudlist asset enumerate` — Enumerate cloud assets

### Utility
- `cloudlist _ _` — Passthrough to cloudlist CLI

## Usage Examples
- "Enumerate cloud assets"
- "List AWS resources"
- "Cloud asset discovery"
- "Find cloud resources"

## Installation

```bash
brew install cloudlist
```

Or via Go:
```bash
go install github.com/projectdiscovery/cloudlist/cmd/cloudlist@latest
```

## Examples

```bash
# Enumerate assets
cloudlist asset enumerate

# Specify provider
cloudlist asset enumerate --provider aws

# JSON output
cloudlist asset enumerate --json

# Use config file
cloudlist asset enumerate --config config.yaml

# Any cloudlist command with passthrough
cloudlist _ _ enumerate
cloudlist _ _ enumerate --provider gcp --json
```

## Key Features
- **Multi-cloud** - AWS, GCP, Azure, DigitalOcean, and more
- **Assets** - Enumerate all cloud assets
- **Discovery** - Asset discovery
- **Security** - Security auditing
- **JSON** - Structured output
- **Config** - Configurable providers
- **Fast** - Quick enumeration
- **Comprehensive** - Wide asset coverage
- **Cross-platform** - Linux, macOS, Windows
- **DevOps** - DevOps friendly

## Notes
- Great for cloud asset management
- Supports many cloud providers
- Perfect for security auditing
- Easy integration with workflows
