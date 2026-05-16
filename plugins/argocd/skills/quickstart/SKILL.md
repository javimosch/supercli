---
name: argocd
description: Use this skill when the user wants to manage ArgoCD applications, clusters, projects, or repositories for GitOps continuous delivery on Kubernetes.
---

# ArgoCD Plugin

Argo CD is a declarative GitOps continuous delivery tool for Kubernetes. This plugin wraps the `argocd` CLI for managing applications, clusters, projects, and repositories.

## Commands

### Self
- `argocd self version` — Print argocd client version

### Applications
- `argocd app list` — List all applications
- `argocd app get <name>` — Show application details
- `argocd app sync <name>` — Sync an application
- `argocd app diff <name>` — Diff against target state
- `argocd app logs <name>` — Stream application logs
- `argocd app history <name>` — Show deployment history
- `argocd app rollback <name> <deployment-id>` — Rollback to a deployment

### Clusters
- `argocd cluster list` — List all registered clusters

### Repositories
- `argocd repo list` — List all configured repositories

### Projects
- `argocd proj list` — List all projects

### ApplicationSets
- `argocd appset list` — List all ApplicationSets

### Certificates
- `argocd cert list` — List repo certificates

### Account & Auth
- `argocd account get-user-info` — Show current user info
- `argocd login do <server>` — Log in to an ArgoCD server
- `argocd context current` — Show current context

### Passthrough
- `argocd _ _ <args>` — Raw passthrough for any argocd command

## Usage Examples

- "list all argocd applications"
- "show details for app guestbook"
- "sync app guestbook"
- "show deployment history for app guestbook"
- "rollback app guestbook to deployment 5"
- "list all clusters registered in argo"
- "list all configured repos"
- "show current user info"

## Installation

```bash
brew install argocd
# or download from GitHub releases
curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
chmod +x /usr/local/bin/argocd
```

Then login to an ArgoCD server:
```bash
argocd login <server-url>
```

## Key Features
- GitOps CD for Kubernetes
- Application sync, diff, rollback, logs
- Multi-cluster management
- Multi-repo management
- Project-based RBAC
- ApplicationSets for templated apps
- Webhook-driven sync

## Requirements
- argocd CLI binary installed
- ArgoCD server running on a Kubernetes cluster
- Login credentials or SSO access
