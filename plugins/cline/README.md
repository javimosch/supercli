# Cline Plugin

This plugin integrates the Cline CLI into dcli with rich non-interactive task wrappers and full namespace passthrough.

## Prerequisites

Ensure `cline` is available on your machine:

```bash
cline --version
```

## Wrapped Commands

### CLI Version

```bash
supercli cline cli version --json
```

### Non-Interactive Task Run

Runs Cline in act mode with `-a -y --json` and streams one JSON event envelope per line before the final summary envelope.

```bash
supercli cline task run --prompt "List files with most LOC in cwd" --cwd . --timeout 30 --json
```

### Non-Interactive Task Plan

Runs Cline in plan mode with `-p -y --json` and the same streaming behavior.

```bash
supercli cline task plan --prompt "Plan a refactor of the auth module" --cwd . --json
```

## Full Passthrough

```bash
supercli cline --help
supercli cline -a -y --json "List files with more LOC in cwd"
```

## Notes

- Prefer the wrapped `cline task run` and `cline task plan` commands for agent automation.
- Those wrappers bake in the documented headless-safe defaults: `--json` plus `-y`, with `-a` or `-p` selected for you.
- Passthrough remains available when you need flags or flows not yet wrapped.
