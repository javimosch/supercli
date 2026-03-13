---
skill_name: copilot.quickstart
description: Agent workflow for running GitHub Copilot CLI in non-interactive programmatic mode.
tags: copilot,github,ai,automation,headless
---

# copilot Quickstart

Use this when you need GitHub Copilot CLI for scripted prompts and machine-readable outputs.

## 1) Install plugin and dependency

```bash
supercli plugins learn copilot
supercli plugins install copilot --json
npm install -g @github/copilot
```

## 2) Login and validate setup

```bash
copilot login
supercli copilot cli version
```

## 3) Programmatic usage

```bash
supercli copilot task ask --prompt "Summarize the current branch changes"
supercli copilot task ask-json --prompt "List top risks in this PR"
```

## 4) Full passthrough for advanced flags

```bash
supercli copilot -p "Explain this module" --output-format json
supercli copilot -p "Draft a migration plan" --agent my-agent --output-format json
```

## 5) Caveats

- Current Copilot CLI build in this environment does not expose JSON output flags; `task ask-json` runs in non-stream text mode (`--stream off`).
- Copilot may require repository trust and auth setup on first run.
- Keep tool permissions explicit for automation; use passthrough to set advanced `--allow-*` options when needed.
