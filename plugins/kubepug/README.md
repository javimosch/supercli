# kubepug Plugin for SuperCLI

[KubePug](https://github.com/kubepug/kubepug) scans your Kubernetes cluster (or static manifest files) and reports every object using deprecated or removed API versions, so you know exactly what breaks before upgrading.

## Installation

```bash
# Download the kubepug release tarball for your platform from https://github.com/kubepug/kubepug/releases and extract the kubepug binary to PATH
# Or: go install github.com/kubepug/kubepug/cmd/kubepug@latest
# Or as a kubectl plugin: kubectl krew install deprecations (invoked as kubectl deprecations)
# Verify: kubepug version

# Install supercli plugin
supercli plugins install ./plugins/kubepug
```

## Commands

- `kubepug self version` — Print kubepug version
- `kubepug cluster scan` — Scan the current kubeconfig context for deprecated/removed APIs (kubepug --k8s-version=v1.30 --format json). Reads live cluster state
- `kubepug files scan` — Scan local manifest files for deprecated APIs (kubepug file --input-dir ./manifests). Works offline, no cluster needed
- `kubepug _ _` — Passthrough to kubepug CLI (e.g. kubepug file --input-file app.yaml --k8s-version=v1.29)

All commands pass extra flags through to the underlying `kubepug` CLI.
