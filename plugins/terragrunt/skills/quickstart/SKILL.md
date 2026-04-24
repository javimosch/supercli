---
name: terragrunt
description: Use this skill when the user wants to manage Terraform modules, apply infrastructure changes with Terragrunt, or keep Terraform configurations DRY.
---

# terragrunt Plugin

Terragrunt is a thin wrapper for Terraform that provides extra tools for working with multiple Terraform modules, managing remote state, and keeping configurations DRY.

## Commands

### Infrastructure
- `terragrunt infra apply` — Apply Terraform infrastructure changes

### Utility
- `terragrunt _ _` — Passthrough to terragrunt CLI

## Usage Examples
- "Apply infrastructure changes"
- "Manage Terraform modules"
- "Terragrunt apply"
- "Infrastructure deployment"

## Installation

```bash
brew install terragrunt
```

Requires Terraform to be installed separately.

## Examples

```bash
# Apply changes
terragrunt infra apply ./modules/vpc

# Auto approve
terragrunt infra apply ./modules/vpc --auto-approve

# Plan only
terragrunt infra apply ./modules/vpc --plan

# Any terragrunt command with passthrough
terragrunt _ _ apply
terragrunt _ _ plan
terragrunt _ _ validate
```

## Key Features
- **DRY** - Keep configs DRY
- **Modules** - Multi-module support
- **State** - Remote state management
- **Dependencies** - Module dependencies
- **Terraform** - Terraform wrapper
- **Locking** - State locking
- **Versioning** - Version constraints
- **CI/CD** - Pipeline friendly
- **Scalable** - Scale infrastructure
- **Reliable** - Production ready

## Notes
- Requires Terraform installed
- Great for multi-module projects
- Manages remote state
- Perfect for team workflows
