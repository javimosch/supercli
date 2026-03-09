# just Plugin Harness

This plugin integrates the just CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Ensure just is available on your machine:

```bash
just --version
```

Many `just` commands operate on a nearby `justfile`. Commands like `--help`, `--version`, and `--list --justfile <path>` are good non-interactive entry points.

## Available Commands

### CLI Version (Wrapped)

Returns the just CLI version via `just --version`.

```bash
dcli just cli version --json
```

### Full Passthrough

You can run any just command through the `just` namespace.

```bash
# List recipes from a specific justfile
dcli just --list --justfile ./justfile

# Evaluate a variable from a justfile
dcli just --evaluate --justfile ./justfile version

# Show CLI help
dcli just --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
