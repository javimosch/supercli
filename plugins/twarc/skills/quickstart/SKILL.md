---
name: twarc
description: Use this skill when the user wants to archive Twitter/X data, export tweets to CSV/JSON, or work with twarc CLI tool.
---

# twarc Plugin

CLI tool for archiving Twitter/X data. Export your tweets to CSV or JSON format.

## Commands

### Configuration
- `twarc configure run` — Configure twarc with X API credentials

### Export Operations
- `twarc timeline export <username>` — Export user timeline to JSON
- `twarc timeline export_csv <username>` — Export user timeline to CSV

### Utility
- `twarc self version` — Print twarc version
- `twarc help show` — Show twarc help
- `twarc _ _` — Run any twarc command directly

## Usage Examples

### Export all your tweets to JSON
```bash
twarc configure run  # First time setup with API credentials
twarc timeline export your_username > tweets.json
```

### Export all your tweets to CSV
```bash
twarc timeline export_csv your_username > tweets.csv
```

## Installation

```bash
pip install twarc
```

## Configuration

Before using twarc, you need to configure it with X API credentials:

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new app and get API credentials
3. Run `twarc configure` and enter your credentials when prompted

Required credentials:
- Consumer Key (API Key)
- Consumer Secret (API Secret)
- Access Token
- Access Token Secret

## Key Features
- Archive all tweets from a user timeline
- Export to JSON or CSV format
- Full tweet data including metadata
- Supports filtering and search
