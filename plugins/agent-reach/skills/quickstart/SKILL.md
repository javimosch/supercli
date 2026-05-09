---
name: agent-reach
description: Use this skill when the user wants to search the web, read Twitter/X, Reddit, YouTube, GitHub, RSS feeds, Chinese platforms (Bilibili, Weibo, XiaoHongShu), or access any internet content through their AI agent — with zero API fees.
---

# Agent Reach Plugin

Give AI agents full internet access with zero API fees. Installs and manages upstream CLI tools for web scraping, social media, video, search, and news.

## Commands

### Self
- `agent-reach self version` — Print version

### Setup Management
- `agent-reach setup install` — Install channels (use `--channels=twitter,weibo` or `--channels=all`)
- `agent-reach setup doctor` — Run health check
- `agent-reach setup watch` — Quick health + update check
- `agent-reach setup check-update` — Check for new versions

### Configure
- `agent-reach configure run` — Configure proxy, cookies, API keys

### Uninstall
- `agent-reach uninstall run` — Remove agent-reach

### Twitter/X
- `agent-reach twitter search` — Search tweets (uses `twitter search <query>`)
- `agent-reach twitter read` — Read a tweet by URL (uses `twitter tweet <url>`)

### Reddit
- `agent-reach reddit search` — Search Reddit (uses `rdt search <query>`)
- `agent-reach reddit read` — Read post by ID (uses `rdt read <id>`)

### YouTube
- `agent-reach youtube info` — Get metadata + transcript (uses `yt-dlp --dump-json`)

### Web
- `agent-reach web read` — Fetch a web page (prefix URL with `https://r.jina.ai/` for clean Markdown)

### Bilibili
- `agent-reach bilibili hot` — Show trending videos (uses `bili hot`)
- `agent-reach bilibili search` — Search videos (uses `bili search <query>`)

### Passthrough
- `agent-reach _ _` — Direct passthrough for any agent-reach command

## Usage Examples
- "Search Twitter for mentions of our product"
- "Read this Reddit thread and summarize"
- "Get YouTube transcript for this tutorial"
- "Read this web page as clean Markdown"
- "Check if all my channels are working"
- "Show trending Bilibili videos"

## Installation

```bash
pipx install https://github.com/Panniantong/agent-reach/archive/main.zip
agent-reach install --env=auto
# Or for specific channels:
agent-reach install --env=auto --channels=twitter,weibo,reddit
```

## Common Workflows

```bash
# Check what's working
agent-reach doctor

# Install Twitter + Weibo
agent-reach install --env=auto --channels=twitter,weibo

# Read a web page as clean Markdown (Jina Reader, no API key needed)
curl -sL "https://r.jina.ai/https://example.com"

# Get YouTube video info
yt-dlp --dump-json "https://youtube.com/watch?v=VIDEO_ID"

# Search Reddit
rdt search "query"

# Read Reddit post
rdt read POST_ID

# Search Twitter
twitter search "query" -n 10

# Read Tweet
twitter tweet URL

# Bilibili
bili hot
bili search "query" --type video

# Exa search (via mcporter)
mcporter call 'exa.web_search_exa(query: "your query", num_results: 5)'
```

## Key Features
- 15+ platforms with zero API fees
- Cookie-based auth for platforms that need login
- Health check (`doctor`) tells you exactly what's working
- `--safe` mode for security-conscious setups
- All config/tokens stored locally in `~/.agent-reach/`
- Upstream tools can be swapped out (pluggable architecture)
