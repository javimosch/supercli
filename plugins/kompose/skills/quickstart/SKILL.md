---
name: kompose
description: Use this skill when the user wants to convert Docker Compose files to Kubernetes manifests, migrate from docker-compose to Kubernetes, generate Helm charts from compose files, or deploy docker-compose apps to a Kubernetes cluster.
---

# Kompose Plugin

Docker Compose to Kubernetes resource converter. Part of the Kubernetes ecosystem.

## Commands

### Self
- `kompose self version` — Print kompose version

### Convert
- `kompose convert to-kubernetes` — Convert docker-compose.yaml to Kubernetes manifests
- `kompose convert to-helm` — Convert docker-compose.yaml to a Helm chart

### Deploy
- `kompose deploy up` — Deploy docker-compose app to Kubernetes directly
- `kompose deploy down` — Remove deployed Kubernetes resources

### Passthrough
- `kompose _ _` — Passthrough for any kompose command

## Usage Examples
- "Convert my docker-compose.yml to Kubernetes manifests"
- "Convert docker-compose to a Helm chart"
- "Deploy my docker-compose app to the Kubernetes cluster"
- "Take down a docker-compose app from Kubernetes"
- "Convert with PVC volumes and 3 replicas"
- "Generate DaemonSet instead of Deployment"
- "Convert to JSON output"

## Installation

```bash
# Linux
curl -L https://github.com/kubernetes/kompose/releases/latest/download/kompose-linux-amd64 -o /usr/local/bin/kompose
chmod +x /usr/local/bin/kompose

# macOS
brew install kompose

# Go
go install github.com/kubernetes/kompose@latest
```

## Quick Start

```bash
# Basic conversion (generates Deployment, Service, etc.)
kompose convert -f docker-compose.yaml

# Convert to Helm chart
kompose convert --chart -o ./helm-chart/

# Deploy directly to Kubernetes
kompose up -f docker-compose.yaml

# Remove deployed resources
kompose down -f docker-compose.yaml

# Customize volumes and replicas
kompose convert --volumes persistentVolumeClaim --replicas 3

# Output to stdout in JSON
kompose convert --stdout --json

# Generate DaemonSet
kompose convert --daemon-set
```

## Key Features
- Supports docker-compose v1, v2, v3
- Generates Deployments, Services, ConfigMaps, PersistentVolumeClaims, etc.
- Helm chart generation (`--chart`)
- Direct cluster deployment (`kompose up`)
- Multiple volume types (PVC, emptyDir, hostPath, ConfigMap)
- Controller type selection (Deployment, DaemonSet, ReplicationController)
- Namespace support
- JSON/YAML output
- Part of the official Kubernetes ecosystem
