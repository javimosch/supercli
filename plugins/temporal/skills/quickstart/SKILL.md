---
name: temporal
description: Use this skill when the user wants to run Temporal Server, manage workflows, activities, or namespaces.
---

# Temporal Plugin

CLI for running Temporal Server and interacting with Workflows, Activities, Namespaces, and other parts of Temporal.

## Commands

### Server
- `temporal server start-dev` — Start Temporal development server

### Workflow
- `temporal workflow list` — List Temporal workflows

### Namespace
- `temporal namespace list` — List Temporal namespaces

## Usage Examples
- "Start a Temporal development server"
- "List all workflows"
- "List all namespaces"

## Installation

```bash
brew install temporal
```

## Examples

```bash
# Start dev server
temporal server start-dev

# List workflows
temporal workflow list

# List namespaces
temporal namespace list
```

## Key Features
- Run Temporal development server locally
- Manage workflows and activities
- Namespace management
- Docker support available
