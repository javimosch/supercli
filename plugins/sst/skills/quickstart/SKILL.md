---
name: sst
description: Use this skill when the user wants to initialize, deploy, diff, or tear down an SST Ion app on AWS or another cloud provider.
---

# sst Plugin

SST Ion is an infrastructure-as-code framework. Apps are defined in TypeScript (`sst.config.ts`), stages isolate environments, and `sst dev` gives a live dev mode with multiplexer TUI.

## Commands

### Lifecycle
- `sst project init` — Initialize sst in a project
- `sst app deploy` — Deploy to a stage (`--stage prod`)
- `sst app remove` — Remove a stage's resources
- `sst app diff` — Preview what a deploy would change
- `sst state unlock` — Force-unlock a stuck state lock
- `sst _ _` — Passthrough (`sst dev`, `sst refresh`, `sst secret`, `sst shell`)

### Info
- `sst self version` — Show version

## Usage Examples

- "Initialize sst in this Next.js app"
- "Deploy this project to the production stage"
- "Show me what a deploy would change"
- "Remove the dev stage"

## Installation

```bash
curl -fsSL https://ion.sst.dev/install | bash
# or: npm install -g sst / brew install sst
```

## Examples

```bash
# New or existing project
supercli sst project init

# Safe preview before any deploy
supercli sst app diff --stage dev

# Deploy to a named stage
supercli sst app deploy --stage production

# Manage secrets non-interactively
supercli sst secret set STRIPE_KEY sk_live_xxx --stage production

# Long-running dev mode (use passthrough / run in terminal)
supercli sst dev
```

## Key Features

- TypeScript `sst.config.ts` — components for Next.js, containers, functions, DBs, DNS
- Per-stage isolation: `sst deploy --stage <name>` creates/separate stacks
- `sst diff` previews changes like terraform plan; `sst refresh` syncs drifted state
- `sst secret set/list` encrypted per-stage secrets
- `sst unlock` recovers from interrupted deploys
- `sst dev` runs functions locally while resources stay live
