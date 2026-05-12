---
name: minipostiz-cli
description: minipostiz-cli — offline social media scheduler for X, Bluesky, Mastodon, Discord, Telegram, LinkedIn, Reddit, Dev.to, Facebook
---
# minipostiz-cli

Offline social media scheduler — agent-first, SQLite-backed, zero cloud deps. Supercli plugin.

**Source:** https://github.com/javimosch/minipostiz-cli

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
