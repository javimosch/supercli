---
name: gh-standup
description: Use this skill when the user wants to generate AI-powered standup reports from GitHub activity, summarize their daily work, or create team standups.
---

# gh-standup Plugin

GitHub CLI extension for generating AI-assisted standup reports.

## Commands

### Report
- `gh-standup report generate` — Generate a standup report

## Usage Examples
- "Generate yesterday's standup report"
- "Look back 3 days"
- "Generate report for specific user"

## Installation

```bash
gh extension install sgoedecke/gh-standup
```

## Examples

```bash
# Basic usage
gh standup

# Look back multiple days
gh standup --days 3

# Specific user
gh standup --user octocat

# Specific repo
gh standup --repo owner/repo

# Different model
gh standup --model xai/grok-3-mini
```

## Key Features
- Uses free GitHub Models (no API key needed)
- Generates reports from GitHub activity
- Supports multiple days
- Custom AI models
- Multiple language support
