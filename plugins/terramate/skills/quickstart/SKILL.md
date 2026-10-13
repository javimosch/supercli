---
name: terramate
description: Use this skill when the user wants to organize Terraform/OpenTofu code into stacks, run commands across changed stacks, or generate code with Terramate.
---

# Terramate Plugin

Terramate is an IaC orchestrator for Terraform, OpenTofu, and Terragrunt. It splits code into independent stacks, detects which ones changed via git, runs commands only where needed, and generates shared code from `generate_*` blocks.

## Commands

### Stacks
- `terramate stack create` — New stack (`terramate create <dir> --name/--id/--description`)
- `terramate stack list` — List stacks (`--changed`, `--tags`, `--why`)

### Execution
- `terramate run exec` — Run a command per stack: `terramate run -- terraform plan`
- `terramate script run` — Run a named Terramate Script
- `terramate generate run` — Emit generate_file/generate_hcl output
- `terramate fmt run` — Format Terramate config files

## Usage Examples

- "List all stacks in this repo"
- "Run terraform plan only on stacks that changed in this branch"
- "Generate the shared provider/backend files"
- "Create a new stack under stacks/prod/api"

## Installation

```bash
go install github.com/terramate-io/terramate/cmd/...@latest
# or: brew install terramate
```

## Examples

```bash
terramate list
terramate list --changed
terramate run --changed -- terraform plan
terramate run --parallel 4 -- terraform apply -auto-approve
terramate generate
terramate experimental drift list
```

## Key Features

- Git-change detection: `--changed` scopes runs to touched stacks (+ dependencies)
- Code generation: `generate_hcl`, `generate_file`, `generate_yaml` blocks share backend/provider config
- `terramate run` respects stack order (after/before/wants) and parallelism
- Terramate Scripts: versioned multi-step runbooks (`terramate script run <name>`)
- Optional Terramate Cloud sync for drift detection and deployment observability
