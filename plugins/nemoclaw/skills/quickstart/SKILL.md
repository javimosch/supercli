---
name: nemoclaw.quickstart
description: Agent workflow for using NemoClaw host CLI through supercli wrappers and passthrough.
tags: nemoclaw,openshell,openclaw,nvidia,sandbox
---

# NemoClaw Quickstart

Use this when you need to manage NemoClaw host/sandbox workflows through supercli.

## 1) Install NemoClaw and plugin

```bash
# Optional: index docs from your private fork
export NEMOCLAW_DOCS_REPO="your-org/NemoClaw"
export NEMOCLAW_DOCS_REF="main"

curl -fsSL https://nvidia.com/nemoclaw.sh | bash
supercli plugins install nemoclaw --json
```

## 2) Validate setup

```bash
supercli nemoclaw self version
supercli nemoclaw system status
```

## 3) Common wrapped workflows

```bash
supercli nemoclaw sandbox list
supercli nemoclaw sandbox status --name my-assistant
supercli nemoclaw sandbox logs --name my-assistant --follow
supercli nemoclaw sandbox connect --name my-assistant
```

## 4) Host lifecycle commands

```bash
supercli nemoclaw host onboard
supercli nemoclaw host onboard-auto --non-interactive --provider cloud --sandbox-name my-assistant --policy-mode skip --api-key "$NVIDIA_API_KEY"
supercli nemoclaw service start
supercli nemoclaw service stop
supercli nemoclaw deploy instance --instance my-gpu-box
```

## 5) Passthrough for advanced actions

```bash
supercli nemoclaw my-assistant policy-list
supercli nemoclaw my-assistant policy-add
supercli nemoclaw my-assistant destroy
```

## 6) Caveats

- NemoClaw is alpha; prefer wrapped commands for stable workflows.
- Use passthrough for sandbox policies and destructive operations.
- Sandbox commands require a valid sandbox name.
