# Aider Plugin

Agent-friendly SuperCLI integration for `aider`, focused on one-shot non-interactive coding tasks.

## Why This Plugin

Aider is interactive by default, but it exposes strong scripting flags:

- `--message` / `--message-file`
- `--yes-always`
- `--no-auto-commits`
- `--dry-run`
- `--no-pretty`
- `--no-stream`

This plugin wraps those options into predictable JSON output for agents.

## Setup

```bash
dcli aider cli setup
```

You will also need a supported model/provider configuration, for example `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or another aider-supported provider.

## Commands

- `aider cli setup`: install `aider-chat`
- `aider cli help-json`: inspect the wrapper contract
- `aider models list --query sonnet`: list matching model names
- `aider code apply`: run a one-shot editing task in a target repo
- `aider code dry-run`: run the same flow without modifying files

## Important Constraints

- pass `--cwd` to target the repo or project directory
- use `files` and `read` to constrain the task scope when possible
- the wrapper disables auto-commits and pretty streaming output
- stdout is JSON; raw aider stdout/stderr are returned inside the JSON payload

## Stability Checklist

- keep non-interactive flags enabled for wrapped commands
- preserve `--no-auto-commits` and let SuperCLI or the user decide how to commit
- capture changed files by comparing git status before and after the run
- treat provider/API-key errors as structured failures, not free-form output

## Skills

- `plugins/aider/skills/quickstart/SKILL.md`
- `plugins/aider/skills/one-shot-edits.md`
- `plugins/aider/skills/dry-run-review.md`
- `plugins/aider/skills/model-and-provider.md`
