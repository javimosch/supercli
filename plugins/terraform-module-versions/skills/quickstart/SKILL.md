---
name: terraform-module-versions
description: Use this skill when the user wants to cli tool that checks terraform code for module updates.
---

# Terraform-module-versions Plugin

CLI tool that checks Terraform code for module updates.

## Commands

### Operations
- `terraform-module-versions code check` — check code via terraform-module-versions
- `terraform-module-versions module list` — list module via terraform-module-versions
- `terraform-module-versions update check` — check update via terraform-module-versions

## Usage Examples
- "terraform-module-versions --help"
- "terraform-module-versions <args>"

## Installation

```bash
go install github.com/keilerkonzept/terraform-module-versions@latest
```

## Examples

```bash
terraform-module-versions --version
terraform-module-versions --help
```

## Key Features
- terraform\n- modules\n- versioning
