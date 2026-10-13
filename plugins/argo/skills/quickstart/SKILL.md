---
name: argo
description: Use this skill when the user wants to submit, watch, retry, or debug Argo Workflows, WorkflowTemplates, or CronWorkflows on Kubernetes.
---

# Argo Workflows Plugin

`argo` is the CLI for Argo Workflows, the container-native workflow engine on Kubernetes. It submits YAML workflows, streams logs, inspects node trees, and manages templates and cron schedules against the Argo Server via your kubeconfig.

## Commands

### Workflows
- `argo workflow submit` — Submit a workflow YAML or template (`--watch` to follow)
- `argo workflow list` — List workflows (`--all-namespaces`, `--since`, `--status`)
- `argo workflow get` — Status and step tree of one workflow
- `argo workflow logs` — Logs from workflow or specific node (`-f` follow, `-c <container>`)
- `argo workflow watch` — Live-render until completion
- `argo workflow retry` — Retry a failed workflow
- `argo workflow delete` — Delete workflows by name

### Templates & cron
- `argo template list` — List WorkflowTemplates
- `argo cron list` — List CronWorkflows

## Usage Examples

- "Submit this workflow manifest and watch it"
- "Show logs of the failed node in workflow X"
- "List workflows that ran in the last 24h"
- "Retry the failed workflow"

## Installation

```bash
curl -sLO https://github.com/argoproj/argo-workflows/releases/latest/download/argo-linux-amd64.gz
gunzip argo-linux-amd64.gz && chmod +x argo-linux-amd64 && mv argo-linux-amd64 ~/.local/bin/argo
# or: brew install argo
```

## Examples

```bash
argo submit -n argo https://raw.githubusercontent.com/argoproj/argo-workflows/main/examples/hello-world.yaml --watch
argo list --all-namespaces --status Failed
argo get my-workflow-abc -n argo
argo logs my-workflow-abc -f
argo retry my-workflow-abc
```

## Key Features

- `--output json`/`--output wide` on list/get for machine-readable data
- `submit --from workflowtemplate/<name>` for parameterized runs
- Node-level actions: `argo stop`, `suspend`, `resume`, `terminate`
- `argo lint`/`argo template lint` to validate manifests before submit
