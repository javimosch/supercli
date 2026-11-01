---
name: goose.quickstart
description: Agent workflow for running Goose in headless mode with non-interactive defaults and structured output.
tags: goose,ai,automation,headless,json,jsonl
---

# Goose Quickstart

Use this when you need Goose in scripts, CI, or agent workflows without interactive prompts.

## Commands
- `goose <resource> <action>` — Execute goose commands
- `goose cli version` — Show installed Goose CLI version
- `goose task text` — Run a Goose headless task and return text output
- `goose task json` — Run a Goose headless task and return structured JSON output
- `goose task stream` — Run a Goose headless task with stream-json events
- `goose task file` — Run a Goose headless task from an instructions file
- `goose _ _` — Passthrough command to execute any Goose CLI command

## 1) Install plugin and dependency

```bash
curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh | CONFIGURE=false bash
supercli plugins install goose --json
```

## 2) Validate setup

```bash
supercli goose cli version
```

## 3) Headless wrappers

```bash
supercli goose task text --text "Summarize this repository"
supercli goose task json --text "Return the top risks in JSON"
supercli goose task stream --text "Plan a refactor"
supercli goose task file --instructions ./task.txt
```

## 4) Passthrough for advanced flags

```bash
supercli goose run --text "Explain the architecture" --output-format json --no-session
supercli goose run --instructions ./task.txt --output-format stream-json --no-session
```

## 5) Caveats

- Wrapped commands include `--no-session` and `--quiet` by default.
- `task stream` returns JSONL event lines; consume them line by line.
- Use passthrough for recipes, provider configuration, or flags not covered by wrappers.
