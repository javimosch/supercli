---
name: aws-nuke
description: Use this skill when the user wants to clean up AWS resources, delete all resources from an AWS account, or manage AWS account cleanup.
---

# aws-nuke Plugin

Remove all resources from an AWS account. Nuke a whole AWS account and delete all its resources. Useful for cleaning up test accounts.

## Commands

### Account Cleanup
- `aws-nuke account nuke` — Nuke all resources in AWS account

### Utility
- `aws-nuke _ _` — Passthrough to aws-nuke CLI

## Usage Examples
- "Clean up AWS account"
- "Delete all AWS resources"
- "Nuke AWS account"
- "AWS resource cleanup"

## Installation

```bash
brew install aws-nuke
```

## Examples

```bash
# Dry run (always do this first!)
aws-nuke account nuke --config nuke-config.yaml --dry-run

# Actual deletion
aws-nuke account nuke --config nuke-config.yaml --no-dry-run

# Use specific profile
aws-nuke account nuke --config nuke-config.yaml --profile myprofile --dry-run

# Any aws-nuke command with passthrough
aws-nuke _ _ run --config nuke-config.yaml --dry-run
```

## Key Features
- **Destructive** - Removes all resources
- **Dry-run** - Preview before deletion
- **Config** - YAML configuration
- **Filters** - Resource filtering
- **Profiles** - AWS profile support
- **Safe** - Dry-run by default
- **Complete** - Comprehensive coverage
- **Regions** - Multi-region support
- **Fast** - Parallel deletion
- **Cloud** - AWS focused

## Notes
- Always use --dry-run first
- Requires AWS credentials
- Destructive operation
- Useful for test accounts
