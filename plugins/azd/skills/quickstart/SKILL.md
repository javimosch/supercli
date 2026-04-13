---
name: azd.quickstart
description: Agent workflow for Azure Developer CLI with non-interactive wrappers and passthrough.
tags: azd,azure,cloud,automation,devops
---

# azd Quickstart

Use this skill when you need deterministic Azure deployment workflows from supercli.

## 1) Learn and install

```bash
supercli plugins learn azd
supercli plugins install ./plugins/azd --json
```

## 2) Validate setup

```bash
supercli azd cli version
supercli azd auth status
```

## 3) Run non-interactive deployment

```bash
supercli azd deploy all --environment dev
```

## 4) Use full upstream command surface

```bash
supercli azd env list
supercli azd up --no-prompt
```

## 5) Caveats

- Prefer `--no-prompt` for unattended runs.
- Use passthrough for commands not wrapped in this plugin.
