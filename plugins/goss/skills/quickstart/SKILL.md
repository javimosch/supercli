---
name: goss
description: Use this skill when the user wants to validate server configuration, Docker containers, or infrastructure state with fast YAML-based tests — health checks, package presence, port listening, file contents, and HTTP endpoints.
---

# goss Plugin

Quick and Easy server testing. Define infrastructure expectations as YAML and run them in milliseconds — ideal for CI, Docker image validation, and post-deploy smoke tests.

## Installation

```bash
curl -fsSL https://goss.rocks/install | sh
# or
brew install goss
```

## Basic Usage

```bash
# Auto-generate tests from current system state
goss add package nginx
goss add port 80
goss add file /etc/nginx/nginx.conf

# Run validation
goss validate

# Validate a Docker image
dgoss run myimage:latest /goss/goss validate
```

## Common Patterns

```bash
# Write tests to goss.yaml
goss add service ssh --port 22

# Validate with formatted output
goss validate --format documentation

# Validate against a remote host
goss validate --endpoint tcp://myserver:22
```

## Usage Examples

- "Check that nginx is installed and port 80 is listening"
- "Validate this Docker image has the right packages"
- "Generate goss tests from the current server state"

## SuperCLI

```bash
sc goss _ _ validate
sc goss _ _ add port 8080
sc plugins learn goss
```
