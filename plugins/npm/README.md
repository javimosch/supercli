# npm Plugin Harness

This plugin integrates the npm CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Ensure npm is available on your machine:

```bash
npm --version
```

If you plan to run authenticated registry commands, log in first:

```bash
npm login
```

## Available Commands

### CLI Version (Wrapped)

Returns the npm CLI version via `npm --version`.

```bash
dcli npm cli version --json
```

### Full Passthrough

You can run any npm command through the `npm` namespace.

```bash
# Search packages as JSON
dcli npm search react --json

# Show current user if authenticated
dcli npm whoami

# Show CLI help
dcli npm --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
