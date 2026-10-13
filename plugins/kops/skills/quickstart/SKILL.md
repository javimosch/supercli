---
name: kops
description: Use this skill when the user wants to create, upgrade, validate, or delete production Kubernetes clusters on AWS/GCE with kOps.
---

# kOps Plugin

kOps (Kubernetes Operations) is the Kubernetes project's official tool for managing production-grade clusters on AWS, GCE, Azure, Hetzner, and more. It stores desired state in a remote state store (`KOPS_STATE_STORE`, e.g. `s3://bucket`) and converges cloud resources to match.

## Commands

### Cluster lifecycle
- `kops cluster list` — List clusters in the state store
- `kops cluster create` — Write cluster config to the store (`--name`, `--zones`, `--cloud`, `--networking`)
- `kops cluster update` — Preview/apply infra changes (`--yes` to apply)
- `kops cluster rolling-update` — Roll out node changes (`--yes`)
- `kops cluster validate` — Check cluster health
- `kops cluster delete` — Tear down (`--yes`)

### Access
- `kops kubeconfig export` — Merge cluster credentials into ~/.kube/config

## Usage Examples

- "Create a 3-zone AWS cluster config"
- "Validate my cluster and export kubeconfig"
- "Rolling-update the nodes after changing instance type"
- "List all clusters in my state store"

## Installation

```bash
curl -Lo kops https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
chmod +x kops && mv kops ~/.local/bin/
# or: brew install kops
```

## Examples

```bash
export KOPS_STATE_STORE=s3://my-kops-state
kops create cluster --name=dev.example.com --zones=us-east-1a --yes
kops update cluster --name dev.example.com --yes --admin
kops export kubeconfig --name dev.example.com --admin=87600h
kops validate cluster --wait 10m
kops rolling-update cluster --yes
```

## Key Features

- Declarative cluster spec in a versioned state store
- Dry-run by default; `--yes` applies
- `kops edit cluster` / `kops edit ig` for spec edits
- Toolbox commands: `kops toolbox dump`, `template`, `addons`
