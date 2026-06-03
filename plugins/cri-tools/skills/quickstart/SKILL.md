---
name: cri-tools
description: Use this skill when the user wants to debug or inspect Kubernetes node container runtimes via CRI (Container Runtime Interface).
---

# cri-tools Plugin

CLI and validation tools for Kubelet Container Runtime Interface (CRI).

## Commands

### Information
- `cri-tools info get` — Get runtime info and stats via CRI
- `cri-tools self version` — Print crictl version

### Pods
- `cri-tools pods list` — List running pods via CRI

### Containers
- `cri-tools containers list` — List running containers via CRI
- `cri-tools containers logs` — Fetch container logs via CRI
- `cri-tools containers exec` — Execute command in a running container via CRI

### Images
- `cri-tools images list` — List container images via CRI
- `cri-tools images pull` — Pull a container image via CRI

### Stats
- `cri-tools stats get` — List container resource usage statistics via CRI

### Passthrough
- `cri-tools _ _` — Passthrough to crictl CLI

## Usage Examples
- "crictl --help"
- "crictl pods"
- "crictl ps -a"
- "crictl images"
- "crictl logs <container-id>"
- "crictl exec -it <container-id> /bin/sh"
- "crictl info"

## Installation

```bash
VERSION=$(curl -s https://api.github.com/repos/kubernetes-sigs/cri-tools/releases/latest | grep tag_name | cut -d '"' -f 4)
wget https://github.com/kubernetes-sigs/cri-tools/releases/download/$VERSION/crictl-$VERSION-linux-amd64.tar.gz
sudo tar zxvf crictl-$VERSION-linux-amd64.tar.gz -C /usr/local/bin
rm -f crictl-$VERSION-linux-amd64.tar.gz
```

## Key Features
- kubernetes
- containers
- debugging
- runtime
- CRI
