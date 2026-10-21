# Clever Tools Skill

Use the Clever plugin when you need agent-friendly access to Clever Cloud through the `clever` CLI.

## Commands
- `clever <resource> <action>` — Execute clever commands
- `clever cli setup` — Install Clever Tools globally
- `clever cli doctor` — Run Clever environment diagnostics
- `clever auth whoami` — Show the active Clever Cloud profile
- `clever apps list` — List Clever Cloud applications
- `clever addons list` — List Clever Cloud add-ons
- `clever tokens list` — List Clever API bridge tokens
- `clever _ _` — Passthrough command for any Clever Tools CLI command

## Skill Map

Use these plugin-local skills for specific flows:

- `plugins/clever/skills/auth-and-profile.md`
- `plugins/clever/skills/resource-inventory.md`
- `plugins/clever/skills/passthrough-safety.md`

## Quick Start

### 1. Setup
```bash
dcli clever cli setup
```

### 2. Authenticate Non-Interactively
Prefer environment variables in CI or agent flows:

```bash
export CLEVER_TOKEN=...
export CLEVER_SECRET=...
```

### 3. Inspect Account State
```bash
dcli clever auth whoami
dcli clever cli doctor
```

### 4. Query Resources
```bash
dcli clever apps list
dcli clever addons list
dcli clever tokens list
```

## Agent Notes

- Clever CLI supports JSON output with `--format json`.
- Wrapped commands are designed to keep stdout parseable.
- Use passthrough only when a dedicated wrapper does not exist yet.
