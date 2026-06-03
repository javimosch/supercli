---
name: gcloud-lite
description: Use this skill when the user wants a lightweight alternative to the full gcloud CLI for Google Cloud operations.
---

# GCloud Lite Plugin

Lightweight Google Cloud CLI, written in Go.

## Commands

### Compute
- `gcloud-lite compute list` — List compute instances

### Storage
- `gcloud-lite storage list` — List storage buckets

### Projects
- `gcloud-lite project list` — List Google Cloud projects

## Usage Examples

```bash
gcloud-lite project list
gcloud-lite compute list --project my-project
gcloud-lite storage list --format json
gcloud-lite --help
```

## Installation

```bash
go install github.com/gcloud-lite/gcloud-lite@latest
```

## Key Features
- Lightweight alternative to full gcloud SDK
- Fast startup and execution
- Common GCP operations covered
- Go-based single binary
