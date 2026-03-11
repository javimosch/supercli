# xurl Plugin Harness

This plugin is a hybrid harness for `xurl`: it indexes the upstream `SKILL.md` and `README.md` into the local skills catalog and exposes a curated set of safe read-only X API wrappers.

## Why This Scope

`xurl` can post, like, follow, upload media, manage auth state, and make arbitrary raw API requests. The wrapped commands in this plugin intentionally focus on low-risk inspection workflows.

- upstream agent docs are indexed into the skills catalog
- read-only wrappers are exposed for common account and timeline lookups
- no wildcard passthrough in v1
- no auth mutation, posting, social mutations, media upload, stream, or webhook wrappers

## Install

```bash
supercli plugins install xurl --json
```

## Explore Indexed Skills

```bash
supercli skills list --catalog --provider xurl --json
supercli skills get xurl:root.skill
supercli skills get xurl:root.readme
```

## Available CLI Commands

```bash
# Wrapped status commands
supercli xurl cli version --json
supercli xurl auth status --json
supercli xurl apps list --json

# Wrapped read-only JSON commands
supercli xurl account whoami --json
supercli xurl users show --target XDevelopers --json
supercli xurl posts show --target https://x.com/XDevelopers/status/123 --json
supercli xurl posts search --query "from:XDevelopers" --max-results 10 --json
supercli xurl timeline list --max-results 10 --json
supercli xurl mentions list --max-results 10 --json
supercli xurl social followers --of XDevelopers --max-results 20 --json
supercli xurl social following --of XDevelopers --max-results 20 --json
```

## Notes

- Wrapped JSON commands force `NO_COLOR=1` so dcli can parse upstream pretty-printed JSON reliably.
- `~/.xurl` stores app credentials and tokens. Never paste its contents into chat or logs.
- Use upstream `xurl` directly for OAuth setup, posting, likes, follows, DMs, media upload, raw requests, streams, and webhooks.
- Removing the plugin also removes its registered skills provider from the local catalog.
