---
skill_name: gemini.quickstart
description: Agent workflow for running Gemini CLI in deterministic headless mode with JSON outputs.
tags: gemini,ai,automation,headless,json
---

# gemini Quickstart

Use this when you need Gemini in scripts or agent workflows without interactive prompts.

## 1) Install plugin and dependency

```bash
supercli plugins learn gemini
supercli plugins install gemini --json
npm install -g @google/gemini-cli
```

## 2) Validate setup

```bash
supercli gemini cli version
```

## 3) Headless modes

```bash
supercli gemini task text --prompt "Summarize this repository"
supercli gemini task ask --prompt "Summarize this repository as JSON"
supercli gemini task stream --prompt "Plan and execute test workflow"
```

## 4) Full passthrough for upstream flags

```bash
supercli gemini -p "Explain the architecture" --output-format json
supercli gemini -p "Run diagnostics" --output-format stream-json
```

## 5) Caveats

- Prefer non-interactive auth for automation (for example `GEMINI_API_KEY`) to avoid login prompts.
- `task stream` returns JSONL event lines; consume line-by-line.
- Use passthrough commands for advanced options not covered by wrappers.
