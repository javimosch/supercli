---
name: hetzner-kube
description: Use this skill when the user wants to provision and manage Kubernetes clusters on Hetzner Cloud.
---

# hetzner-kube Plugin

CLI tool for provisioning and managing Kubernetes clusters on Hetzner Cloud infrastructure.

## Commands

### Cluster Management
- `hetzner-kube cluster create` — Create a Kubernetes cluster on Hetzner Cloud

## Usage Examples
- "Create a new K8s cluster on Hetzner"
- "List my Hetzner Kubernetes clusters"
- "Add a node to my Hetzner cluster"
- "Delete a Hetzner K8s cluster"

## Installation

```bash
go install github.com/nicm/hetzner-kube@latest
```

## Examples

```bash
hetzner-kube cluster create --name my-cluster --nodes 3
hetzner-kube cluster list
hetzner-kube cluster add-node --name my-cluster
hetzner-kube cluster delete --name my-cluster
hetzner-kube kubeconfig --name my-cluster
```

## Key Features
- Automated cluster provisioning
- Multi-node cluster support
- Automatic kubeconfig download
- Node scaling (add/remove)
- Hetzner Cloud API integration
- SSH key management
