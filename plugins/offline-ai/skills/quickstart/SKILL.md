---
name: offline-ai.quickstart
description: Agent workflow for running offline-ai scripts in deterministic non-interactive mode.
tags: offline-ai,ai,scripting,automation,headless
---

# offline-ai Quickstart

Use this when you need programmable prompt-engine scripts in automation workflows.

## Commands
- `offline-ai <resource> <action>` — Execute offline-ai commands
- `offline-ai cli version` — Show installed offline-ai CLI version
- `offline-ai script run` — Run an offline-ai script entry with optional input payload
- `offline-ai script run-file` — Run an offline-ai script file with optional input payload
- `offline-ai _ _` — Passthrough command to execute any offline-ai CLI command

## 1) Install plugin and dependency

```bash
supercli plugins learn offline-ai
supercli plugins install ./plugins/offline-ai --json
npm install -g @offline-ai/cli
```

## 2) Validate setup

```bash
supercli offline-ai cli version
```

## 3) Run scripts non-interactively

```bash
supercli offline-ai script run --entry translator --input '{"file":"./TODO","target":"English"}'
supercli offline-ai script run-file --file ./scripts/translator.ai --input '{"target":"English"}'
```

## 4) Full passthrough for advanced usage

```bash
supercli offline-ai run -f translator '{"file":"./TODO","target":"English"}'
supercli offline-ai run translator '{"topic":"release notes"}'
```

## 5) Caveats

- Prefer non-interactive script runs in CI; avoid REPL-style sessions.
- Use explicit payloads so outputs remain deterministic and easy to parse.
- If you need structured output modes, pass exact upstream flags via passthrough.
