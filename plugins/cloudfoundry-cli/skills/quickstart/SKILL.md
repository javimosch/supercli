---
name: cloudfoundry-cli
description: Use this skill when the user wants to deploy applications to Cloud Foundry, manage CF apps, or interact with Cloud Foundry platforms from the command line.
---

# cloudfoundry-cli Plugin

The official Cloud Foundry command line client. Deploy and manage applications on Cloud Foundry platforms directly from the terminal.

## Commands

### Application Deployment
- `cloudfoundry-cli app deploy` — Deploy application to Cloud Foundry

### Application Status
- `cloudfoundry-cli app status` — Check application status

### Utility
- `cloudfoundry-cli _ _` — Passthrough to cf CLI

## Usage Examples
- "Deploy to Cloud Foundry"
- "Check app status"
- "Manage CF application"
- "Push application"

## Installation

```bash
brew install cloudfoundry/tap/cf-cli
```

## Examples

```bash
# Deploy application
cloudfoundry-cli app deploy my-app

# With manifest
cloudfoundry-cli app deploy my-app -f manifest.yml

# Push without starting
cloudfoundry-cli app deploy my-app --no-start

# Check status
cloudfoundry-cli app status my-app

# Any cf command with passthrough
cloudfoundry-cli _ _ push my-app
cloudfoundry-cli _ _ apps
cloudfoundry-cli _ _ logs my-app
```

## Key Features
- **Deploy** - Application deployment
- **Scale** - Scaling apps
- **Logs** - Log streaming
- **Services** - Service binding
- **Routes** - Route management
- **Spaces** - Space management
- **Orgs** - Organization management
- **Buildpacks** - Buildpack support
- **CI/CD** - Pipeline friendly
- **Multi-platform** - Cloud Foundry platforms

## Notes
- Requires Cloud Foundry target
- Supports manifest files
- Great for PaaS deployments
- Perfect for enterprise platforms
