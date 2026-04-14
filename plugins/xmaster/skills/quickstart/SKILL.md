---
name: xmaster
description: Use this skill when the user wants to post tweets, search Twitter/X, manage DMs, schedule posts, or analyze engagement from the command line.
---

# xmaster Plugin

X/Twitter CLI for developers and AI agents.

## Commands

### Posting
- `xmaster post create` — Post a tweet
- `xmaster reply create` — Reply to a tweet
- `xmaster thread create` — Post a thread

### Reading
- `xmaster search run` — Search tweets
- `xmaster user show` — Show user profile
- `xmaster timeline` — View timeline

### Engagement
- `xmaster like` — Like a tweet
- `xmaster retweet` — Retweet

## Usage Examples
- "Post a tweet saying Hello world"
- "Search for tweets about Rust"
- "Check user profile"

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/199-biotechnologies/xmaster/master/install.sh | sh
```

Or:
```bash
brew install 199-biotechnologies/tap/xmaster
```

## Examples

```bash
# Configure credentials
xmaster config set keys.api_key YOUR_KEY
xmaster config check

# Post
xmaster post "Hello from xmaster"

# Search
xmaster search "rust lang"
xmaster search-ai "latest AI news"

# User info
xmaster user elonmusk

# JSON output (for agents)
xmaster --json post "Hello"
```

## Key Features
- X API v2 + xAI/Grok search
- Structured JSON for AI agents
- Scheduling with launchd
- Bookmark archiving
- Pre-flight post analysis
