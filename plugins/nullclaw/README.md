# nullclaw Plugin

This plugin is a hybrid harness: it indexes NullClaw's upstream docs into the dcli skill-doc catalog and exposes the local `nullclaw` binary through wrapped commands plus full passthrough.

## What It Adds

- top-level project context from `README.md`, `AGENTS.md`, and contributor docs
- operator guidance for installation, configuration, commands, usage, security, and gateway API
- implementation guidance for contributors working on the Zig codebase

## Install

```bash
supercli plugins install nullclaw --json
```

## Explore Indexed Skill Documents

```bash
supercli skills list --catalog --provider nullclaw --json
supercli skills get nullclaw:root.agents
supercli skills get nullclaw:docs.en.commands
supercli skills get nullclaw:docs.en.architecture
```

## Available CLI Commands

```bash
# Wrapped version command
supercli nullclaw cli version --json

# Wrapped status command
supercli nullclaw system status --json

# Full passthrough
supercli nullclaw models list
supercli nullclaw agent -m "hello"
```

## Notes

- This plugin indexes remote markdown from `https://github.com/nullclaw/nullclaw`.
- It does not install the upstream `nullclaw` binary for you.
- If you also want the runtime locally, follow the upstream install path such as `brew install nullclaw`.
- Removing the plugin also removes its registered skill-doc provider from the local catalog.
