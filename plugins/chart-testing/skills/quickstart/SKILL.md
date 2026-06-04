---
name: chart-testing
description: Use this skill when the user wants to lint and test Helm charts
---

# Chart-testing Plugin

lint and test Helm charts

## Commands
- `chart-testing self version` — Print chart-testing version
- `chart-testing _ _` — Passthrough to ct CLI

## Usage Examples
- "Lint this Helm chart"
- "Test chart deployment"
- "Validate chart templates"

## Installation

```bash
go install github.com/chart-testing/chart-testing/cmd/ct@latest
```

## Examples
```bash
ct lint --charts ./charts/mychart
ct install --charts ./charts/mychart
ct list --chart-dirs ./charts
```

## Key Features
- Automated Helm chart linting
- Template validation
- CI/CD integration
- Kubernetes test clusters
