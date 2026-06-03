---
name: burn
description: Use this skill when the user wants to monitor Kubernetes resource budgets and cost consumption.
---

# Burn Plugin

Kubernetes budget monitoring, written in Go.

## Commands

### Budgets
- `burn budget list` — List Kubernetes budgets
- `burn budget check` — Check budget consumption status
- `burn budget set` — Set a budget for a namespace

## Usage Examples

```bash
burn budget list
burn budget check --namespace production
burn budget set --namespace dev --limit 100 --period daily
burn --help
```

## Installation

```bash
go install github.com/helm/burn@latest
```

## Key Features
- Monitor resource consumption against budgets
- Set cost limits per namespace
- Real-time budget status checks
- Kubernetes-native integration
