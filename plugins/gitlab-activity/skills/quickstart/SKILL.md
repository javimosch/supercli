# GitLab Activity CLI - Agent Quickstart

## Purpose
Retrieve GitLab user activity for agent consumption with structured output and minimal dependencies.

## When to Use
- When agents need to check recent GitLab activity
- When analyzing user contribution patterns
- When generating activity reports
- When monitoring project engagement

## Basic Usage

### Get current user's activity (last 7 days)
```bash
gitlab-activity-cli me --instance https://gitlab.com --token ~/.gitlab/token
```

### Get activity from specific GitLab instance
```bash
gitlab-activity-cli me --instance https://git.example.com --token ~/.gitlab/token
```

### Get activity for specific time range
```bash
gitlab-activity-cli me --days 2 --instance https://gitlab.com --token ~/.gitlab/token
gitlab-activity-cli me --since 2026-05-21 --until 2026-05-22 --instance https://gitlab.com --token ~/.gitlab/token
```

### Filter by project
```bash
gitlab-activity-cli me --project myproject --instance https://gitlab.com --token ~/.gitlab/token
```

### Get activity for specific user
```bash
gitlab-activity-cli user username --days 3 --instance https://gitlab.com --token ~/.gitlab/token
```

## Machine-Readable Output

### JSON format for parsing
```bash
gitlab-activity-cli me --json --instance https://gitlab.com --token ~/.gitlab/token
```

Returns structured JSON with version field for schema stability:
```json
{
  "version": "1.0",
  "user": "username",
  "instance": "https://gitlab.com",
  "period": {"days": 7},
  "total_events": 8,
  "projects": [...]
}
```

## Token Configuration

Both `--instance` and `--token` flags are required for all operations.

## Exit Codes for Automation
- `0` - Success
- `85` - Invalid arguments
- `92` - Resource not found (user not found)
- `100` - API error (connection failed, auth failed)
- `110` - Internal error

## Common Agent Patterns

### Check if user has activity today
```bash
gitlab-activity-cli me --days 1 --json --instance https://gitlab.com --token ~/.gitlab/token | jq '.total_events > 0'
```

### Get commit messages from specific project
```bash
gitlab-activity-cli me --project myproject --json --instance https://gitlab.com --token ~/.gitlab/token | \
  jq -r '.projects[].activity[] | select(.push_data.commit_title != "") | .push_data.commit_title'
```

### Monitor daily activity count
```bash
gitlab-activity-cli me --days 1 --json --instance https://gitlab.com --token ~/.gitlab/token | jq '.total_events'
```

## Notes
- Default time range: last 7 days
- Maximum events per request: 100
- Output format: structured text (default) or JSON
- Non-interactive: all operations via flags