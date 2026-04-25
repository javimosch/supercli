---
name: saw
description: Use this skill when the user wants to manage AWS resources, list AWS services, or work with AWS from the command line with a simplified interface.
---

# saw Plugin

A modern and intuitive CLI tool for AWS. Manage AWS resources and services with a simple, human-friendly command line interface.

## Commands

### AWS Management
- `saw aws list` — List AWS resources
- `saw aws describe` — Describe AWS resource

### Utility
- `saw _ _` — Passthrough to saw CLI

## Usage Examples
- "List AWS resources"
- "Describe AWS resource"
- "AWS CLI simplified"
- "Manage AWS from CLI"

## Installation

```bash
brew install saw
```

Or via Go:
```bash
go install github.com/TylerBrock/saw/cmd/saw@latest
```

## Examples

```bash
# List EC2 instances
saw ls ec2

# List S3 buckets
saw ls s3

# Describe instance
saw describe i-1234567890abcdef0

# Describe with region
saw describe i-1234567890abcdef0 --region us-west-2

# Any saw command with passthrough
saw _ _ ls ec2
saw _ _ describe resource-id
saw _ _ ls s3 --region us-east-1
```

## Key Features
- **AWS** - AWS management
- **Simple** - Simple interface
- **Intuitive** - Human-friendly
- **List** - Resource listing
- **Describe** - Resource details
- **CLI** - Command line native
- **Cloud** - Cloud resources
- **DevOps** - DevOps workflows
- **Regions** - Multi-region
- **Fast** - Fast operations

## Notes
- Simplifies AWS CLI
- Human-friendly commands
- Great for AWS operations
- Supports multiple services
- Requires AWS credentials
