# Himalaya Plugin Harness

This plugin integrates the Himalaya email CLI into dcli with safe read-only wrappers and full namespace passthrough.

## Prerequisites

Ensure `himalaya` is available on your machine:

```bash
himalaya --version
```

You also need a working Himalaya config, usually at `~/.config/himalaya/config.toml`, with at least one configured account.

## Available Commands

### Safe Read-Only Wrappers

These wrappers target JSON-capable, automation-friendly commands and avoid write-side email actions.

```bash
dcli himalaya cli version --json
dcli himalaya account list --json
dcli himalaya account doctor --account personal --json
dcli himalaya folder list --account personal --json
dcli himalaya envelope list --account personal --folder INBOX --page 1 --json
dcli himalaya envelope thread --account personal --folder INBOX --id 42 --json
dcli himalaya message read-preview --account personal --folder INBOX --id 42 --json
```

### Full Passthrough

You can run any Himalaya command through the `himalaya` namespace.

```bash
# Explicit upstream JSON mode
dcli himalaya --output json account list

# Raw CLI help
dcli himalaya --help
```

## Notes

- Wrapped list and preview commands bake in Himalaya's `--output json` support and return parsed data in the dcli envelope.
- The wrapped `message read-preview` command forces `--preview` so it can inspect mail without marking it seen.
- Destructive or interactive flows such as `account configure`, `message send`, `message write`, and delete/move operations are intentionally left out of wrapped v1.
- Himalaya passthrough does not understand upstream `--json`; use `--output json` when you want Himalaya itself to emit JSON.
