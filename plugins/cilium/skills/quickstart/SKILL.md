---
name: cilium
description: Use this skill when the user wants to install, check, or troubleshoot Cilium eBPF networking and Hubble observability on a Kubernetes cluster.
---

# Cilium Plugin

Cilium CLI (`cilium`) installs, manages, and troubleshoots Cilium — the eBPF-based CNI providing networking, observability (Hubble), and service mesh for Kubernetes. It operates against the current kubeconfig context.

## Commands

### Cluster lifecycle
- `cilium cluster install` — Install Cilium into the current cluster (`--set` for Helm values, `--version` to pin)
- `cilium status get` — Deployment status, agent health, and feature summary
- `cilium _ _` — Passthrough (`cilium upgrade`, `cilium uninstall`)

### Observability
- `cilium hubble enable` — Turn on Hubble flow observability
- `cilium connectivity test` — End-to-end connectivity test suite

### Multi-cluster
- `cilium clustermesh status` — ClusterMesh connectivity status

## Usage Examples

- "Install Cilium on this cluster"
- "Check whether Cilium agents are healthy"
- "Enable Hubble and run the connectivity test"
- "What's the clustermesh status?"

## Installation

```bash
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/main/stable.txt)
curl -L --remote-name-all https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-amd64.tar.gz
tar xzvf cilium-linux-amd64.tar.gz && mv cilium ~/.local/bin/
# or: brew install cilium-cli
```

## Examples

```bash
cilium version --client
cilium install --version 1.16.5
cilium status --wait
cilium hubble enable --ui
cilium connectivity test
cilium upgrade --version 1.16.5
```

## Key Features

- One-command Cilium install/upgrade/uninstall with auto-detected settings
- `connectivity test` deploys test workloads and validates eBPF data paths
- Built-in Hubble enablement plus `hubble` subcommands for flow inspection
- ClusterMesh, BGP, and egress-gateway management subcommands
