# si — SuperInsights CLI

Agent-first CLI for querying SuperInsights analytics.

## Usage

```bash
# Configure
export SI_PROJECT_ID="<project_id>"
export SI_TOKEN="<public_link_token>"
export SI_API_URL="https://superinsights.coolify.intrane.fr"  # default

# Commands
si stats                          # Summary counts
si events list                    # List recent events
si events list --event $click     # Filter by event name
si pageviews                      # Pageview analytics
si errors                         # Error aggregates
si autocapture --top              # Top clicked elements
```

## Agent-friendly features

- `--json` for structured output
- Semantic exit codes: 0 (ok), 80 (bad arg), 85 (missing config), 92 (not found), 100 (API error), 105 (connection), 110 (internal)
- stdout for data, stderr for errors
- `--help-json` for machine-readable schema
- All output wrapped in `{"version":"1.0","data":...}` envelope

## Exit codes

| Code | Meaning | Agent action |
|------|---------|-------------|
| 0    | Success | Proceed |
| 80   | Invalid argument | Fix input, don't retry |
| 85   | Missing config | Set SI_PROJECT_ID and SI_TOKEN |
| 92   | Not found | Check project ID and token |
| 100  | API error | Retry with backoff |
| 105  | Connection failed | Check SI_API_URL |
| 110  | Internal error | Report bug |

## Install

```bash
# Via supercli
sc plugins install si

# Or direct download
curl -L https://github.com/javimosch/si-cli/releases/download/v0.1.0/si-linux-amd64 -o /usr/local/bin/si
chmod +x /usr/local/bin/si
```
