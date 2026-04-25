---
name: env-manager
description: Use this skill when the user wants to manage environment files, switch between environments, validate .env files, or check environment variables.
---

# env-manager Plugin

A CLI tool for managing environment files in different environments. Switch, validate, and check environment variables.

## Commands

### Environment Management
- `env-manager switch environment` — Switch between environment configurations

### Utility
- `env-manager _ _` — Passthrough to env-manager CLI

## Usage Examples
- "Switch to development environment"
- "Validate .env file"
- "Check unused environment variables"
- "Manage environment configurations"

## Installation

```bash
npm install -g env-manager
```

## Examples

```bash
# Switch environment
env-manager switch environment development

# Switch to production
env-manager switch environment production

# Validate .env file
env-manager validate

# Check unused variables
env-manager check-unused

# Any env-manager command with passthrough
env-manager _ _ switch development
env-manager _ _ validate
```

## Key Features
- **Environment switching** - Easy environment changes
- **Validation** - Check .env file syntax
- **Unused detection** - Find unused variables
- **Multiple environments** - dev, test, prod, etc.
- **Safe** - Validates before switching
- **Simple** - Easy to use
- **Cross-platform** - Works everywhere
- **.env support** - Standard dotenv format

## Supported Environments
- **development** - Development environment
- **testing** - Testing environment
- **production** - Production environment
- **staging** - Staging environment
- Custom environments supported

## Notes
- Uses .env files by default
- Validates before switching
- Checks for unused variables
- Great for multi-environment projects
- Standard dotenv format
