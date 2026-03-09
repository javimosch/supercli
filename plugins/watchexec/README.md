# watchexec Plugin Harness

This plugin integrates the watchexec CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Ensure watchexec is available on your machine:

```bash
watchexec --version
```

## Available Commands

### CLI Version (Wrapped)

Returns the watchexec CLI version via `watchexec --version`.

```bash
dcli watchexec cli version --json
```

### Full Passthrough

You can run any watchexec command through the `watchexec` namespace.

```bash
# Show help
dcli watchexec --help

# Print the manual
dcli watchexec --manual

# Run a watcher command directly
dcli watchexec -e js -- echo changed
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
