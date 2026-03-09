# Supabase Plugin Harness

This plugin integrates the Supabase CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install Supabase CLI globally or locally:

```bash
# Global install
npm install -g supabase

# Local install in this repo
npm install -D supabase
```

Verify the binary:

```bash
supabase --version
# if local only:
npx --no-install supabase --version
```

Authenticate before running management commands:

```bash
supabase login
```

## Available Commands

### Projects List (Wrapped)

Returns the authenticated account projects via `supabase projects list --output json`.

```bash
dcli supabase projects list --json
```

### Full Passthrough

You can run any Supabase CLI command through the `supabase` namespace.

```bash
# Show CLI help
dcli supabase --help

# List projects directly via passthrough
dcli supabase projects list --output json
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
