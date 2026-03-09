# Pulumi Plugin Harness

This plugin integrates the Pulumi CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install Pulumi with your preferred package manager, then verify it is available:

```bash
pulumi version
```

Authenticate before running stack or cloud-backed operations:

```bash
pulumi login
```

## Available Commands

### CLI Version (Wrapped)

Returns the Pulumi CLI version via `pulumi version`.

```bash
dcli pulumi cli version --json
```

### Full Passthrough

You can run any Pulumi CLI command through the `pulumi` namespace.

```bash
# List stacks as JSON
dcli pulumi stack ls --json

# Show current user
dcli pulumi whoami

# Show CLI help
dcli pulumi --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
