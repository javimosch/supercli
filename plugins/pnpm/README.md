# pnpm Plugin Harness

This plugin integrates the pnpm CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Ensure pnpm is available on your machine:

```bash
pnpm --version
```

If you plan to run authenticated registry commands, log in first:

```bash
pnpm login
```

## Available Commands

### CLI Version (Wrapped)

Returns the pnpm CLI version via `pnpm --version`.

```bash
dcli pnpm cli version --json
```

### Full Passthrough

You can run any pnpm command through the `pnpm` namespace.

```bash
# Search packages as JSON
dcli pnpm search react --json

# Show current user if authenticated
dcli pnpm whoami

# Show CLI help
dcli pnpm --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
