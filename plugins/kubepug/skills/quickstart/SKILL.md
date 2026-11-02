---
name: kubepug
description: Use this skill when the user needs to check a Kubernetes cluster or manifest files for deprecated/removed API versions before upgrading, e.g. 'what breaks if I go to 1.28'.
---

# kubepug Plugin

[KubePug](https://github.com/kubepug/kubepug) scans your Kubernetes cluster (or static manifest files) and reports every object using deprecated or removed API versions, so you know exactly what breaks before upgrading.

## Commands

- `kubepug self version` — Print kubepug version
- `kubepug cluster scan` — Scan the current kubeconfig context for deprecated/removed APIs (kubepug --k8s-version=v1.30 --format json). Reads live cluster state
- `kubepug files scan` — Scan local manifest files for deprecated APIs (kubepug file --input-dir ./manifests). Works offline, no cluster needed
- `kubepug _ _` — Passthrough to kubepug CLI (e.g. kubepug file --input-file app.yaml --k8s-version=v1.29)

## Installation

```bash
# Download the kubepug release tarball for your platform from https://github.com/kubepug/kubepug/releases and extract the kubepug binary to PATH
# Or: go install github.com/kubepug/kubepug/cmd/kubepug@latest
# Or as a kubectl plugin: kubectl krew install deprecations (invoked as kubectl deprecations)
# Verify: kubepug version
```

Cluster scans use your current kubeconfig context. Pass --k8s-version=vX.Y to simulate the target upgrade version. File mode (--input-file/--input-dir) works offline on static manifests.
