---
name: k8tz
description: Use this skill when the user wants to inject timezone configurations into Kubernetes pods
---

# K8tz Plugin

inject timezone configurations into Kubernetes pods

## Commands
- `k8tz self version` — Print k8tz version
- `k8tz _ _` — Passthrough to k8tz CLI

## Usage Examples
- "Set timezone for this deployment"
- "Inject timezone into pods"
- "Configure UTC offset for K8s"

## Installation

```bash
go install github.com/nicholasgasior/k8tz@latest
```

## Examples
```bash
k8tz inject --timezone America/New_York deployment.yaml
k8tz patch --namespace production --timezone UTC
```

## Key Features
- Automatic timezone injection
- Mutating webhook
- Per-pod configuration
- CronJob timezone support
