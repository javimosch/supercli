# Aider Dry-Run Review Skill

Use `dcli aider code dry-run` to preview proposed edits before allowing file modifications.

## Command Pattern

```bash
dcli aider code dry-run \
  --cwd /absolute/path/to/repo \
  --prompt "<requested change>" \
  --files path/to/file
```

## Review Workflow

1. Confirm `exit_code == 0`.
2. Read `stdout` for the proposed SEARCH/REPLACE content.
3. Verify `changed_files` stays empty in dry-run mode.
4. If acceptable, rerun with `code apply`.

## Agent Notes

- Dry-run output is advisory; no edits are applied.
- Use dry-run for policy-sensitive or broad refactors.
