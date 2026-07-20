---
name: diun
description: Use this skill when the user wants notifications when Docker images are updated on a registry — watch container tags, validate config, or run diun as a long-lived service.
---

# diun Plugin

Docker Image Update Notifier. Monitors container registries and alerts when tracked images have new tags or digests. Supports Slack, email, Telegram, webhooks, and many other channels.

## Installation

```bash
# Docker (recommended)
docker run -d --name diun \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v ./diun.yml:/diun.yml:ro \
  crazymax/diun

# Standalone binary from GitHub releases
# https://github.com/crazy-max/diun/releases/latest
```

## Basic Usage

```bash
# Validate configuration
diun check-config --config diun.yml

# Start watching registries
diun serve --config diun.yml

# Dry run without sending notifications
diun serve --config diun.yml --no-notif
```

## Configuration

Create `diun.yml` with watched images and notification providers. See the [official docs](https://crazymax.dev/diun/) for provider-specific settings.

## Usage Examples

- "Notify me when nginx:latest gets a new digest"
- "Validate my diun config before deploying"
- "Watch Docker Hub tags for my base images"

## SuperCLI

```bash
sc diun self check-config --config diun.yml
sc diun self serve --config diun.yml
sc plugins learn diun
```
