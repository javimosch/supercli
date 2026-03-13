# Aider One-Shot Edits Skill

Use this skill for controlled one-shot edits with `dcli aider code apply`.

## Preferred Command Shape

```bash
dcli aider code apply \
  --cwd /absolute/path/to/repo \
  --prompt "<clear change request>" \
  --files path/to/file1,path/to/file2
```

## Guidance

- Keep prompts precise and outcome-focused.
- Limit `--files` scope to reduce unintended edits.
- Add `--read` files for context that must not be modified.
- Run `dry-run` first when change risk is medium/high.

## Output Contract

The wrapper returns JSON with:

- `stdout`
- `stderr`
- `exit_code`
- `changed_files`

Use these fields for post-run control flow.
