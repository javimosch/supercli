# Vercel Plugin Harness

This plugin integrates the [Vercel CLI](https://vercel.com/docs/cli) into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install Vercel CLI first:

```bash
npm install -g vercel
vercel --version
```

Authenticate before running account or project operations:

```bash
vercel login
```

## Available Commands

### Account Whoami (Wrapped)

Returns the currently logged in Vercel account username.

```bash
dcli vercel account whoami --json
```

### Full Passthrough

You can run any Vercel CLI command through the `vercel` namespace.

```bash
# List recent deployments
dcli vercel list

# List projects
dcli vercel project ls

# Check CLI version
dcli vercel --version
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
