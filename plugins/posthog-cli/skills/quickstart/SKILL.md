---
name: posthog-cli
description: Use this skill when the user wants to query product analytics events, manage feature flags, or pull analytics data from PostHog.
---

# PostHog CLI

Query events, manage feature flags, and pull analytics data from the terminal.

## Commands

- `posthog-cli events query` — Query PostHog events
- `posthog-cli flags list` — List feature flags
- `posthog-cli _ _` — Passthrough to posthog CLI

## Installation

```bash
npm i -g @posthog/cli
```

## Authentication

Set `POSTHOG_API_KEY` and `POSTHOG_PROJECT_ID` environment variables.

## Usage Examples

- "Query page views from last 7 days"
- "List all feature flags"
- "Toggle a feature flag on"
- "Pull analytics data"

## Key Commands

```bash
# Query events
posthog events query --event "page_view" --days 7

# List feature flags
posthog feature-flags list

# Toggle feature flag
posthog feature-flags toggle <flag-key> --enable
```

## Key Features
- **Event Queries** - Query product analytics
- **Feature Flags** - Manage flags
- **JSON Output** - Structured data
- **API Key Auth** - Simple auth
