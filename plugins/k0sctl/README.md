# k0sctl Plugin for SuperCLI

[k0sctl](https://github.com/k0sproject/k0sctl) deploys and upgrades k0s Kubernetes clusters declaratively: describe your hosts and desired k0s spec in k0sctl.yaml and 'k0sctl apply' converges the cluster over SSH.

## Installation

```bash
# Download k0sctl for your platform from https://github.com/k0sproject/k0sctl/releases and move it to PATH
# Or: brew install k0sctl
# Or: go install github.com/k0sproject/k0sctl@latest
# Verify: k0sctl version

# Install supercli plugin
supercli plugins install ./plugins/k0sctl
```

## Commands

- `k0sctl self version` — Print k0sctl version
- `k0sctl config init` — Generate a starter k0sctl.yaml cluster spec (k0sctl init > k0sctl.yaml). Add hosts inline: k0sctl init --k0s user@host
- `k0sctl cluster apply` — Provision or converge the cluster from k0sctl.yaml (k0sctl apply --config k0sctl.yaml). Idempotent — re-run to upgrade or scale
- `k0sctl cluster kubeconfig` — Fetch the admin kubeconfig for the deployed cluster (k0sctl kubeconfig > kubeconfig.yaml)
- `k0sctl cluster backup` — Back up cluster state and certificates (k0sctl backup --config k0sctl.yaml)
- `k0sctl cluster reset` — Uninstall k0s and reset all hosts in k0sctl.yaml (k0sctl reset --config k0sctl.yaml)
- `k0sctl _ _` — Passthrough to k0sctl CLI (config status/edit, completion, other subcommands)

All commands pass extra flags through to the underlying `k0sctl` CLI.
