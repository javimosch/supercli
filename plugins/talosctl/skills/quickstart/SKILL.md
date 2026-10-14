---
name: talosctl
description: Use this skill when the user manages Talos Linux clusters — the immutable Kubernetes OS with no SSH/shell — covering machine config, cluster health, upgrades, logs, and disposable local clusters.
---

# talosctl Plugin

`talosctl` is the management CLI for Talos Linux, a minimal immutable OS built for Kubernetes. All node operations happen over a mutual-TLS gRPC API — there is no SSH, no shell, no package manager on the nodes. Machine config is declarative YAML applied via `talosctl apply-config`.

## Commands

- `talosctl cluster health` — Wait for node/etcd/control-plane health
- `talosctl cluster create` — Disposable Talos cluster in Docker/QEMU
- `talosctl cluster kubeconfig` — Fetch admin kubeconfig
- `talosctl machine get` — Machine resources (members, services, links)
- `talosctl machine logs` — Service logs (kubelet, etcd, machined)
- `talosctl machine apply-config` — Push machine config to a node
- `talosctl _ _` — Passthrough to talosctl (dashboard, upgrade, bootstrap, ...)

## Usage Examples

- "Create a throwaway 3-node Talos cluster in Docker for testing"
- "Check whether etcd is healthy on my control plane"
- "Apply this updated machine config without rebooting"

## Installation

```bash
brew install siderolabs/tap/talosctl
# or download talosctl-linux-amd64 from GitHub releases
talosctl version --client
```

## Examples

```bash
# Local test cluster in Docker (needs docker running)
talosctl cluster create --name test --workers 2
talosctl kubeconfig   # merge admin kubeconfig

# Check cluster health
talosctl health -n 10.0.0.11

# Inspect machine resources, kubectl-style
talosctl get members -o wide
talosctl get services

# Upgrade a node to a new Talos version
talosctl upgrade -n 10.0.0.11 --image ghcr.io/siderolabs/installer:v1.8.0
```

## Key Features

- Fully declarative: `talosctl gen config` produces machine config YAML
- `talosctl get` mirrors kubectl for OS-level resources
- `talosctl dashboard` — real-time node/cluster TUI
- Built-in etcd snapshot/bootstrap/upgrade workflows
- Pairs with Omni (Sidero SaaS) for fleet management
