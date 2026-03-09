# uv Plugin Harness

This plugin integrates the uv CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Ensure uv is available on your machine:

```bash
uv --version
```

If you plan to use private package indexes, authenticate first:

```bash
uv auth login <service>
```

## Available Commands

### CLI Version (Wrapped)

Returns the uv CLI version via `uv --version`.

```bash
dcli uv cli version --json
```

### Full Passthrough

You can run any uv command through the `uv` namespace.

```bash
# Show available Python interpreters
dcli uv python list

# Run a pip-compatible command
dcli uv pip list --format json

# Show CLI help
dcli uv --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
