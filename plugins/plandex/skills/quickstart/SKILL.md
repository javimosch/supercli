---
name: plandex.quickstart
description: Agent workflow for using Plandex CLI in non-interactive mode with explicit autonomy controls.
tags: plandex,ai,planning,automation,headless
---

# plandex Quickstart

Use this when you need deterministic, scriptable Plandex runs from supercli.

## 1) Install plugin and dependency

```bash
supercli plugins learn plandex
supercli plugins install ./plugins/plandex --json
# Install Plandex CLI from official docs and ensure `plandex` is on PATH
```

## 2) Validate setup

```bash
supercli plandex cli version
```

## 3) Create and tune a plan

```bash
supercli plandex plan new --name "repo-refactor" --full
supercli plandex plan set-auto full
```

## 4) Run one-shot tasks

```bash
supercli plandex task tell --prompt "Implement tests for parser module"
supercli plandex task chat --prompt "Explain remaining tech debt"
```

## 5) Full passthrough for advanced commands

```bash
supercli plandex apply --auto-update-context --auto-exec
supercli plandex chat "Summarize architecture risks"
```

## 6) Caveats

- Higher autonomy settings can apply code changes quickly; use deliberately.
- Start with explicit prompts and review results in CI logs.
- Use passthrough when wrappers do not expose needed flags.
