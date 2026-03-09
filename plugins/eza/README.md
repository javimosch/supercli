# eza Plugin Harness

This plugin integrates the eza CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Ensure eza is available on your machine:

```bash
eza --version
```

## Available Commands

### CLI Version (Wrapped)

Returns the eza CLI version via `eza --version`.

```bash
dcli eza cli version --json
```

### Full Passthrough

You can run any eza command through the `eza` namespace.

```bash
# List files one per line without color
dcli eza --oneline --color=never

# Long listing for a specific path
dcli eza --long .

# Show CLI help
dcli eza --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
