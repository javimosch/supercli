# clusterctl Plugin for SuperCLI

[clusterctl](https://github.com/kubernetes-sigs/cluster-api) is the Cluster API CLI: bootstrap a management cluster, render workload-cluster manifests, fetch kubeconfigs, move clusters between management clusters, and drive upgrades.

## Installation

```bash
# Download clusterctl for your platform from https://github.com/kubernetes-sigs/cluster-api/releases and move it to PATH
# Or: brew install clusterctl
# Or: go install sigs.k8s.io/cluster-api/cmd/clusterctl@latest
# Verify: clusterctl version

# Install supercli plugin
supercli plugins install ./plugins/clusterctl
```

## Commands

- `clusterctl self version` — Print clusterctl version
- `clusterctl management init` — Install Cluster API and provider components into the management cluster (clusterctl init --infrastructure aws). Providers: aws, azure, gcp, vsphere, docker...
- `clusterctl clusters generate` — Render a workload-cluster manifest (clusterctl generate cluster mycluster --kubernetes-version v1.30.0 --control-plane-machine-count 1 --worker-machine-count 3)
- `clusterctl clusters kubeconfig` — Fetch a workload cluster's kubeconfig (clusterctl get kubeconfig mycluster > kubeconfig.yaml)
- `clusterctl clusters describe` — Show a cluster's object tree and conditions (clusterctl describe cluster mycluster)
- `clusterctl clusters move` — Move Cluster API objects to another management cluster (clusterctl move --to-kubeconfig target.yaml)
- `clusterctl upgrades plan` — Show available Cluster API / provider upgrades (clusterctl upgrade plan)
- `clusterctl _ _` — Passthrough to clusterctl CLI (delete, upgrade apply, config, alpha subcommands)

All commands pass extra flags through to the underlying `clusterctl` CLI.
