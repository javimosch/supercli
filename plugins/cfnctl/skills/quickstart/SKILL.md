---
name: cfnctl
description: Use this skill when the user wants to aws cloudformation stack management cli.
---

# Cfnctl Plugin

AWS CloudFormation stack management CLI.

## Commands

### Operations
- `cfnctl stack deploy` — deploy stack via cfnctl
- `cfnctl stack delete` — delete stack via cfnctl
- `cfnctl stack list` — list stack via cfnctl
- `cfnctl stack status` — status stack via cfnctl

## Usage Examples
- "cfnctl --help"
- "cfnctl <args>"

## Installation

```bash
go install github.com/rogerwelin/cfnctl@latest
```

## Examples

```bash
cfnctl --version
cfnctl --help
```

## Key Features
- aws\n- cloudformation\n- infrastructure
