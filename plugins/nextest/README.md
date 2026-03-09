# nextest Plugin Harness

This plugin integrates the `cargo-nextest` CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Ensure `cargo-nextest` is available on your machine:

```bash
cargo-nextest --version
```

Many nextest commands are most useful inside a Rust workspace. Help and version commands work anywhere, and listing commands are good non-interactive entry points.

## Available Commands

### CLI Version (Wrapped)

Returns the `cargo-nextest` CLI version via `cargo-nextest --version`.

```bash
dcli nextest cli version --json
```

### Full Passthrough

You can run any `cargo-nextest` command through the `nextest` namespace.

```bash
# Show help
dcli nextest --help

# List tests in machine-readable form
dcli nextest list --message-format json

# Run tests in a workspace
dcli nextest run
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
