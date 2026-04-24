---
name: create-go-app
description: Use this skill when the user wants to create a new Go application, generate a Go project template, or scaffold a production-ready Go project.
---

# create-go-app Plugin

A complete and self-contained solution for developers to create production-ready projects with backend (Go), frontend, and deploy automation by running only one CLI command.

## Commands

### Project Creation
- `create-go-app project create` — Create new Go application

### Utility
- `create-go-app _ _` — Passthrough to create-go-app CLI

## Usage Examples
- "Create new Go application"
- "Generate Go project template"
- "Scaffold Go backend"
- "Create production-ready Go project"

## Installation

```bash
brew install create-go-app
```

Or via Go:
```bash
go install github.com/create-go-app/cli/cmd/create-go-app@latest
```

## Examples

```bash
# Create new project
create-go-app project create myapp

# Use specific template
create-go-app project create myapp --template standard

# Specify framework
create-go-app project create myapp --framework gin

# Any create-go-app command with passthrough
create-go-app _ _ create myapp
create-go-app _ _ create myapp --template full
```

## Key Features
- **Production-ready** - Complete project structure
- **Backend** - Go backend with various frameworks
- **Frontend** - Frontend templates included
- **Docker** - Docker configuration
- **Ansible** - Deployment automation
- **Templates** - Multiple project templates
- **Fast** - Quick project generation
- **Configurable** - Customizable templates
- **Complete** - Full-stack solutions
- **Easy** - Single command setup

## Notes
- Great for starting new projects
- Includes deployment automation
- Multiple framework support
- Docker and Ansible included
