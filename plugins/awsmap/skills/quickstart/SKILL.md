---
name: awsmap
description: Use this skill when the user wants to discover and map AWS resources across accounts.
---

# AWSmap Plugin

Fast AWS resource mapping, written in Python.

## Commands

### Resources
- `awsmap resource scan` — Scan and map AWS resources
- `awsmap resource list` — List discovered AWS resources

## Usage Examples

```bash
awsmap resource scan --region us-east-1
awsmap resource list --type ec2
awsmap resource scan --profile production --output json
awsmap --help
```

## Installation

```bash
pip install awsmap
```

## Key Features
- Fast multi-account AWS resource discovery
- Cross-service resource mapping
- JSON output for automation
- Profile-based credential support
