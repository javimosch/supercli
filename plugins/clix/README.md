# clix Plugin Harness

This plugin is a hybrid harness for `clix`: it indexes the upstream `SKILL.md` and `README.md` into the local skills catalog and exposes a curated set of safe read-only wrappers.

## Why This Scope

`clix` can post, delete, like, retweet, and mutate bookmarks using cookie-based auth. The wrapped commands in this plugin intentionally focus on low-risk read-only workflows.

- upstream agent docs are indexed into the skills catalog
- read-only wrappers are exposed for auth status, timelines, search, tweets, users, and bookmarks
- no wildcard passthrough in v1
- no auth mutation, posting, delete, like, retweet, or bookmark mutation wrappers

## Install

```bash
supercli plugins install clix --json
```

## Explore Indexed Skills

```bash
supercli skills list --catalog --provider clix --json
supercli skills get clix:root.skill
supercli skills get clix:root.readme
```

## Available CLI Commands

```bash
supercli clix auth status --json
supercli clix timeline list --type following --count 20 --json
supercli clix posts search --query "from:openai" --type latest --count 20 --json
supercli clix posts show --id 1234567890 --json
supercli clix users show --handle openai --json
supercli clix bookmarks list --json
```

## Notes

- Wrapped commands always request upstream `--json` output and return parsed data in the dcli envelope.
- `clix` uses cookie-based auth and may access local browser/session data. Treat that auth state as sensitive.
- Use upstream `clix` directly for login, account switching, posting, deleting, likes, retweets, and bookmark mutations.
- Removing the plugin also removes its registered skills provider from the local catalog.
