---
name: atmos
description: Use this skill when the user wants to manage cloud infrastructure with Terraform and Helm, deploy stacks, or automate DevOps workflows using YAML configurations.
---

# atmos Plugin

Universal Tool for DevOps and Cloud Automation. Manage complex cloud infrastructure with Terraform, Helm, and tools using YAML-based configurations.

## Commands

### Stack Deployment
- `atmos stack deploy` — Deploy a stack
- `atmos stack plan` — Plan a stack deployment

### Utility
- `atmos _ _` — Passthrough to atmos CLI

## Usage Examples
- "Deploy infrastructure stack"
- "Plan Terraform deployment"
- "Manage cloud components"
- "Run atmos workflow"

## Installation

```bash
brew install atmos
```

Requires Terraform and optionally Helm to be installed.

## Examples

```bash
# Deploy a component
atmos stack deploy vpc --stack dev

# Plan deployment
atmos stack plan database --stack staging

# Dry run
atmos stack deploy vpc --stack dev --dry-run

# Any atmos command with passthrough
atmos _ _ terraform deploy vpc --stack dev
atmos _ _ validate stacks
atmos _ _ list stacks
```

## Key Features
- **Terraform** - Terraform orchestration
- **Helm** - Helm chart deployment
- **Stacks** - Stack-based configs
- **YAML** - YAML configuration
- **Components** - Component management
- **Workflows** - Workflow automation
- **Vendoring** - Component vendoring
- **Validation** - Config validation
- **Multi-cloud** - Multi-cloud support
- **DRY** - DRY principle

## Notes
- Requires Terraform installed
- Uses YAML-based stack configs
- Great for complex infrastructure
- Supports multi-environment setups
