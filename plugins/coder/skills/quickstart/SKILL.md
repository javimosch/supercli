---
name: coder
description: Use this skill when the user wants to provision or manage remote development environments — create cloud workspaces from templates, connect via SSH, or manage team dev infrastructure with Terraform.
---

# coder Plugin

Provision and manage remote development environments on your own infrastructure. Uses Terraform templates and provisioners to spin up consistent, team-shared dev workspaces.

## Installation

```bash
curl -L https://coder.com/install.sh | sh
```

## Basic Usage

```bash
# Log in to a Coder deployment
coder login https://coder.example.com

# List available templates and workspaces
coder list

# Create a new workspace from a template
coder create my-workspace --template docker-dev

# Start/stop a workspace
coder start my-workspace
coder stop my-workspace

# Open an SSH connection
coder ssh my-workspace
```

## Common Patterns

```bash
# Show workspace details and connection info
coder show my-workspace

# Update a workspace after template changes
coder update my-workspace

# Delete a workspace
coder delete my-workspace

# List all templates
coder templates list
```

## Usage Examples

- "Create a remote dev workspace from the docker template"
- "Start my Coder workspace and SSH into it"
- "List all running workspaces on our Coder server"

## SuperCLI

```bash
sc coder _ _ list
sc coder _ _ create my-workspace --template go-dev
sc plugins learn coder
```
