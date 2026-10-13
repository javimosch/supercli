---
name: promptfoo
description: Use this skill when the user wants to evaluate prompts across LLMs, run model comparisons, or red-team an AI app from the CLI.
---

# promptfoo Plugin

promptfoo is the go-to open-source LLM eval CLI. A `promptfooconfig.yaml` defines prompts × providers × test cases; `promptfoo eval` runs the matrix with assertions; `promptfoo redteam` generates and executes adversarial attacks.

## Commands

### Evals
- `promptfoo project init` — Scaffold `promptfooconfig.yaml`
- `promptfoo eval run` — Run the eval matrix (`-o results.json`, `-j` threads, `--no-cache`, `-p`/`-r` for ad-hoc prompt/provider)
- `promptfoo eval list` — `promptfoo list evals`, past runs
- `promptfoo cache clear` — Drop cached model responses

### Red team
- `promptfoo redteam init` — Interactive redteam config scaffold
- `promptfoo redteam run` — Fire adversarial attacks at `--target`
- `promptfoo _ _` — Passthrough (`view`, `show`, `export`, `generate dataset`, `compare`, ...)

## Usage Examples

- "Compare GPT-4o and a local ollama model on these 20 test prompts"
- "Set up a promptfoo eval for my support bot prompt"
- "Red-team my chat endpoint for prompt injection"

## Installation

```bash
npm install -g promptfoo       # or: npx promptfoo@latest
```

Provider keys via env (`OPENAI_API_KEY`, ...); `ollama:<model>` and OpenAI-compatible endpoints need no cloud account.

## Examples

```bash
promptfoo init
promptfoo eval -o results.json
promptfoo eval -r ollama:qwen2.5 -r openai:gpt-4o-mini
promptfoo redteam run --target https://app.example/chat
```

## Key Features

- Prompt matrices: many prompts × providers × vars, YAML-driven, cached
- Assertions: contains/regex/JSON-schema/similarity + model-graded rubrics
- Red team: jailbreak/injection/PII plugins auto-generated vs your target
- Local-first: works fully offline with `ollama:` provider; `view` UI optional
