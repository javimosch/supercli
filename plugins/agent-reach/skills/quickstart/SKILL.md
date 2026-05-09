---
name: agent-reach
description: Use this skill when the user wants to search the web, read Twitter/X, Reddit, YouTube, GitHub, RSS feeds, Chinese platforms (Bilibili, Weibo, XiaoHongShu), or access any internet content through their AI agent — with zero API fees.
---

# Agent Reach Plugin

Give AI agents full internet access with zero API fees. Installs and manages upstream CLI tools for web scraping, social media, video, search, and news.

## Commands

### Setup
- `agent-reach setup install` — Install core channels (use `--channels=twitter,weibo` or `--channels=all` for more)
- `agent-reach setup doctor` — Run health check on all channels
- `agent-reach setup watch` — Quick health + update check (for cron/scheduled tasks)
- `agent-reach setup check-update` — Check for new versions

### Configure
- `agent-reach configure run` — Configure settings: proxy, twitter-cookies, xhs-cookies, groq-key, or `--from-browser`

### Uninstall
- `agent-reach uninstall run` — Uninstall agent-reach (`--dry-run` to preview, `--keep-config` to preserve)

### Passthrough
- `agent-reach _ _` — Direct passthrough for any agent-reach command

## Usage Examples
- "Set up agent-reach and check what channels are working"
- "Install core channels and enable Twitter and Weibo"
- "Search Twitter for mentions of our product"
- "Read this Reddit thread and summarize"
- "Get YouTube transcripts for this tutorial"
- "Read this RSS feed and find recent articles"
- "Search GitHub for LLM frameworks"

## Installation

```bash
pipx install https://github.com/Panniantong/agent-reach/archive/main.zip
agent-reach install --env=auto
# Or for specific channels:
agent-reach install --env=auto --channels=twitter,weibo,reddit
```

## Channel Commands (after setup)

| Platform | Command |
|----------|---------|
| Web | `curl -s "https://r.jina.ai/URL"` |
| Twitter/X | `twitter search "query" -n 10` |
| YouTube | `yt-dlp --dump-json URL` |
| Reddit | `rdt search "query"` / `rdt read POST_ID` |
| GitHub | `gh search repos "query"` |
| RSS | `python3 -c "import feedparser; ..."` |
| Bilibili | `bili hot` / `bili search "query"` |
| 小红书 | via mcporter MCP |
| 微博 | via mcporter MCP |
| Exa Search | `mcporter call 'exa.web_search_exa(...)'` |

## Key Features
- 15+ platforms with zero API fees
- Cookie-based auth for platforms that need login
- Health check (`doctor`) tells you exactly what's working
- `--safe` mode for security-conscious setups
- `--dry-run` to preview all operations
- All config/tokens stored locally in `~/.agent-reach/`
- Upstream tools can be swapped out (pluggable architecture)
