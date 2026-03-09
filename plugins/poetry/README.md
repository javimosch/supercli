# Poetry Plugin Harness

This plugin integrates the Poetry CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Ensure Poetry is available on your machine:

```bash
poetry --version
```

If you plan to publish or access private repositories, configure Poetry first:

```bash
poetry config --list
```

## Available Commands

### CLI Version (Wrapped)

Returns the Poetry CLI version via `poetry --version`.

```bash
dcli poetry cli version --json
```

### Full Passthrough

You can run any Poetry command through the `poetry` namespace.

```bash
# Show global Poetry information
dcli poetry about

# Show installed self plugins as JSON
dcli poetry self show --format json

# Show CLI help
dcli poetry --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
