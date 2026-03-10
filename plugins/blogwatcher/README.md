# BlogWatcher Plugin

This plugin is a hybrid harness: it indexes BlogWatcher's upstream `SKILL.md` and `README.md` into the local skills catalog and exposes the local `blogwatcher` binary through wrapped commands plus full passthrough.

## What It Adds

- agent-oriented usage guidance from the upstream `SKILL.md`
- project and end-user documentation from the upstream `README.md`
- non-interactive wrappers for the local BlogWatcher CLI

## Install

```bash
supercli plugins install blogwatcher --json
```

## Explore Indexed Skills

```bash
supercli skills list --catalog --provider blogwatcher --json
supercli skills get blogwatcher:root.skill
supercli skills get blogwatcher:root.readme
```

## Available CLI Commands

```bash
# Wrapped version command
supercli blogwatcher cli version --json

# Wrapped list/add/remove commands
supercli blogwatcher blogs list --json
supercli blogwatcher blogs add --name "Example" --url "https://example.com/blog" --feed-url "https://example.com/feed.xml" --json
supercli blogwatcher blogs remove --name "Example" --json

# Wrapped scan and article commands
supercli blogwatcher scan run --workers 4 --json
supercli blogwatcher articles list --all --json
supercli blogwatcher articles read-all --json

# Full passthrough
supercli blogwatcher articles --all
supercli blogwatcher scan "Example Blog"
```

## Notes

- This plugin indexes remote markdown from `https://github.com/Hyaxia/blogwatcher`.
- Wrapped commands return raw text in the dcli envelope because upstream does not expose JSON output.
- The wrapped `blogs remove` and `articles read-all` commands force `--yes` to avoid interactive prompts.
- BlogWatcher stores its SQLite data under `~/.blogwatcher`, so use an isolated `HOME` if you want disposable smoke testing.
- Removing the plugin also removes its registered skills provider from the local catalog.
