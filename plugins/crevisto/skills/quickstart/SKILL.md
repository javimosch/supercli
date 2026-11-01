# Crevisto CLI — Quick Start

AI image generation from your terminal. 100+ curated tools, pay-per-use, no subscription.

## Commands
- `crevisto <resource> <action>` — Execute crevisto commands
- `crevisto trial` — Get a free trial token (5 credits, no email needed)
- `crevisto tools` — List all 100+ AI image tools
- `crevisto generate` — Generate an image with a specific tool
- `crevisto whoami` — Check credit balance and trial status
- `crevisto gallery` — Browse public gallery

## Install

```sh
curl -fsSL https://crevisto.com/install.sh | sh
```

## Quick start

```sh
crevisto trial          # 5 free credits, no email
crevisto tools          # list all 100+ tools
crevisto generate linkedin-avatar --input photo=./me.jpg --output ./result.webp
```

## BYOK (unlimited)

```sh
crevisto set-key sk-or-v1-xxxxx
crevisto generate logo-maker --input description="A tech startup logo" --output ./logo.webp
```

## Links

- Web app: https://crevisto.com
- All tools: https://crevisto.com/tools
- GitHub: https://github.com/javimosch/crevisto
