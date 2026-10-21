---
name: minipostiz-cli
description: minipostiz-cli — offline social media scheduler for X, Bluesky, Mastodon, Discord, Telegram, LinkedIn, Reddit, Dev.to, Facebook
---
# minipostiz-cli

Offline social media scheduler — agent-first, SQLite-backed, zero cloud deps. Supercli plugin.

**Source:** https://github.com/javimosch/minipostiz-cli

## Commands
- `minipostiz-cli <resource> <action>` — Execute minipostiz-cli commands
- `minipostiz auth set-x` — Store X/Twitter OAuth 1.0a credentials (apiKey, apiSecret, accessToken, accessSecret)
- `minipostiz auth set-bluesky` — Store Bluesky credentials (handle + app password)
- `minipostiz auth set-discord` — Store Discord webhook URL
- `minipostiz auth set-telegram` — Store Telegram bot token and chat ID
- `minipostiz auth set-mastodon` — Store Mastodon instance URL and access token
- `minipostiz auth set-devto` — Store Dev.to API key
- `minipostiz auth set-linkedin` — Store LinkedIn access token and person URN
- `minipostiz auth set-reddit` — Store Reddit OAuth credentials and target subreddit
- `minipostiz auth set-facebook` — Store Facebook page access token and page ID
- `minipostiz auth list` — List all configured social media platform credentials
- `minipostiz auth remove` — Remove stored credentials for a platform
- `minipostiz auth verify` — Verify stored credentials for a platform are valid
- `minipostiz post publish` — Publish a message immediately to one or more social media platforms
- `minipostiz post schedule` — Schedule a post for future publication on a social media platform
- `minipostiz schedule list` — List scheduled posts, optionally filtered by platform
- `minipostiz schedule cancel` — Cancel a scheduled post by ID
- `minipostiz history list` — Show post history with optional platform and status filters
- `minipostiz platforms list` — List all supported platforms and their auth requirements
- `minipostiz daemon start` — Start the background scheduler daemon
- `minipostiz daemon stop` — Stop the background scheduler daemon
- `minipostiz daemon status` — Check if the scheduler daemon is running
- `minipostiz self status` — Show minipostiz-cli system status: version, db path, platforms, daemon

## Install

```bash
npx superacli plugins install --git https://github.com/javimosch/minipostiz-cli --json
cd ~/.local/share/superacli/plugins/minipostiz-cli && bun build src/main.ts --compile --outfile bin/minipostiz
ln -sf ~/.local/share/superacli/plugins/minipostiz-cli/bin/minipostiz ~/.local/bin/minipostiz
```

## Auth

```bash
sc minipostiz auth set-x --apiKey K --apiSecret S --accessToken T --accessSecret A
sc minipostiz auth set-bluesky --handle user.bsky.social --password apppassword
sc minipostiz auth set-discord --webhookUrl https://discord.com/api/webhooks/ID/TOKEN
sc minipostiz auth set-telegram --botToken 123:abc --chatId -100123
sc minipostiz auth set-mastodon --instanceUrl https://mastodon.social --accessToken TOKEN
sc minipostiz auth set-devto --apiKey YOUR_KEY
sc minipostiz auth set-linkedin --accessToken TOKEN --personUrn urn:li:person:ID
sc minipostiz auth set-reddit --clientId ID --clientSecret S --username U --password P --subreddit mySub
sc minipostiz auth set-facebook --pageAccessToken TOKEN --pageId PAGE_ID
sc minipostiz auth list
```

## Publish & Schedule

```bash
sc minipostiz post publish --platform x --message "Hello Twitter"
sc minipostiz post publish --platform x,bluesky,mastodon --message "Cross-post"
sc minipostiz post publish --platform all --message "Broadcast to all configured platforms"
sc minipostiz post schedule --platform x --message "Future post" --date "2026-06-20 20:30:00"
sc minipostiz schedule list
sc minipostiz schedule cancel --id 42
sc minipostiz history list
sc minipostiz daemon start
```
