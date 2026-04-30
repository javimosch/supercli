---
name: tkn
description: Use this skill when the user wants to manage Tekton CI/CD pipelines, tasks, or pipeline runs on Kubernetes.
---

# tkn Plugin

CLI for interacting with Tekton CI/CD pipelines on Kubernetes.

## Commands

### Pipeline
- `tkn pipeline list` — List Tekton pipelines
- `tkn pipeline logs` — Show logs for a pipeline run

### Task
- `tkn task list` — List Tekton tasks

## Usage Examples
- "List all Tekton pipelines"
- "Show logs for a pipeline run"
- "List all tasks"

## Installation

```bash
brew install tektoncd-cli
```

## Examples

```bash
# List pipelines
tkn pipeline list

# List tasks
tkn task list

# Show pipeline logs
tkn pipeline logs my-pipeline

# List pipeline runs
tkn pipelinerun list
```

## Key Features
- Manage Tekton pipelines and tasks
- View pipeline run logs
- Resource creation and deletion
- Kubernetes-native CI/CD
