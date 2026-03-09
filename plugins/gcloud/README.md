# Google Cloud CLI Plugin Harness

This plugin integrates the Google Cloud CLI (`gcloud`) into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install Google Cloud CLI with your preferred package manager, then verify it is available:

```bash
gcloud --version
```

Authenticate before running account or project commands:

```bash
gcloud auth login
```

## Available Commands

### Account List (Wrapped)

Returns authenticated accounts via `gcloud auth list --format=json`.

```bash
dcli gcloud account list --json
```

### Full Passthrough

You can run any Google Cloud CLI command through the `gcloud` namespace.

```bash
# List projects
dcli gcloud projects list --format=json

# List compute zones
dcli gcloud compute zones list --format=json

# Show CLI help
dcli gcloud --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
