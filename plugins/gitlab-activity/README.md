# GitLab Activity Plugin for SuperCLI

Retrieve GitLab user activity with agent-friendly output.

## Installation

```bash
# Build from source
cd ~/ai/supercli-clis/gitlab-activity-cli
go build -ldflags "-s -w" -o gitlab-activity-cli main.go
sudo cp gitlab-activity-cli /usr/local/bin/

# Verify installation
gitlab-activity-cli version
```

## Usage

### Basic usage
```bash
# Get your activity (last 7 days)
gitlab-activity-cli me

# Get activity from specific instance
gitlab-activity-cli me --instance https://git.geored.fr

# Filter by time range
gitlab-activity-cli me --days 2
gitlab-activity-cli me --since 2026-05-21 --until 2026-05-22

# Filter by project
gitlab-activity-cli me --project georedv3

# Get another user's activity
gitlab-activity-cli user jarancibia --days 3
```

### JSON output
```bash
gitlab-activity-cli me --json
```

## Features

- **Auto-detect GitLab instances** from token files
- **Flexible time filtering** (days, date ranges)  
- **Project filtering**
- **Multiple output formats** (text, JSON)
- **Agent-friendly design** (non-interactive, semantic exit codes)
- **Zero external dependencies**

## Token Configuration

Auto-detects tokens from `~/.gitlab/`:
- `jar-token` → gitlab.com
- `geored` → git.geored.fr

For custom instances, specify both `-instance` and `-token`.

## Options

- `-days int` - Number of days to look back (default: 7)
- `-instance string` - GitLab instance URL (default: auto-detect)
- `-token string` - Path to token file (default: auto-detect)
- `-project string` - Filter by project name
- `-since string` - Start date (YYYY-MM-DD)
- `-until string` - End date (YYYY-MM-DD)
- `-json` - Output in JSON format

## Exit Codes

- `0` - Success
- `85` - Invalid arguments
- `92` - Resource not found
- `100` - API error
- `110` - Internal error