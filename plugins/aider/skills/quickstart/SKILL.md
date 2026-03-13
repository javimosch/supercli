# Aider Skill

Use the Aider plugin when you want a one-shot coding sub-agent through the `aider` CLI without entering interactive chat mode.

## Skill Map

Use these plugin-local skills for focused workflows:

- `plugins/aider/skills/one-shot-edits.md`
- `plugins/aider/skills/dry-run-review.md`
- `plugins/aider/skills/model-and-provider.md`

## Quick Start

### 1. Setup
```bash
dcli aider cli setup
```

### 2. Check Wrapper Contract
```bash
dcli aider cli help-json
```

### 3. Discover Models
```bash
dcli aider models list --query sonnet
```

### 4. Run A One-Shot Edit Task
```bash
dcli aider code apply \
  --cwd /absolute/path/to/repo \
  --prompt "Add clear docstrings to the public functions in src/utils.py" \
  --files src/utils.py
```

### 5. Preview Without Writing
```bash
dcli aider code dry-run \
  --cwd /absolute/path/to/repo \
  --prompt "Refactor src/index.ts to reduce duplication" \
  --files src/index.ts
```

## Agent Notes

- The wrapper always uses one-shot `--message` mode.
- Auto-commits are disabled.
- Output is wrapped into JSON with `stdout`, `stderr`, `exit_code`, and `changed_files`.
- Pass `--cwd` explicitly because plugin execution does not assume the user project directory.
