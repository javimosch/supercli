---
name: kubie
description: Use this skill when the user wants to switch Kubernetes contexts or namespaces, or run one-off commands in a specific cluster without touching the current shell.
---

# kubie Plugin

kubie manages kubectl contexts and namespaces. Each switch can spawn an isolated shell with its own kubeconfig, so parallel terminals never step on each other.

## Commands

- `kubie self version` — Print kubie version
- `kubie ctx use` — Switch or spawn a shell in a context (kubie ctx <name>; omit name for the fzf picker; -n sets namespace)
- `kubie ns use` — Switch namespace in the current context (kubie ns <name>; omit name for the picker)
- `kubie exec run` — Run a command inside a context+namespace: kubie exec <ctx> <ns> -- <cmd> (e.g. kubie exec prod default -- kubectl get pods)
- `kubie _ _` — Passthrough to kubie CLI

## Usage Examples

- "Switch to the staging cluster context"
- "Run kubectl get pods against prod without changing my shell"
- "Pick a namespace interactively with fzf"

## Installation

```bash
cargo install kubie
# or: brew install kubie
```

## Examples

```bash
kubie ctx                    # fuzzy-pick a context (needs fzf)
kubie ctx prod               # spawn shell in prod context
kubie ctx prod -n kube-system
kubie ns monitoring          # switch namespace
kubie exec prod default -- kubectl get pods
```

## Key Features

- Isolated per-shell kubeconfig — switching never leaks into other terminals
- Recursive shells remember history of nested contexts
- kubie exec runs commands in a context non-interactively — great for scripts
