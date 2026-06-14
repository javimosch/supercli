---
name: supercli.gtm
description: SuperCLI go-to-market strategy, executed actions, channel intelligence, and campaign workflow. Use when doing GTM, marketing, outreach, social posting, launching on HN/Reddit/ProductHunt, submitting to awesome lists, or growing GitHub stars.
---

# SuperCLI GTM Playbook

> **Agentic GTM for SuperCLI** — save this skill to persist state across sessions.
> Last updated: June 2026 · 7,003 plugins in catalog

---

## What's Been Done (State)

### ✅ Pull Requests Submitted (5 awesome lists)

| PR | Repo | URL | Status |
|----|------|-----|--------|
| #1153 | `agarrharr/awesome-cli-apps` | [PR link](https://github.com/agarrharr/awesome-cli-apps/pull/1153) | ⏳ Awaiting review |
| #728 | `alebcay/awesome-shell` | [PR link](https://github.com/alebcay/awesome-shell/pull/728) | ⏳ Awaiting review |
| #1099 | `e2b-dev/awesome-ai-agents` | [PR link](https://github.com/e2b-dev/awesome-ai-agents/pull/1099) | ⏳ Awaiting review |
| #265 | `devtoolsd/awesome-devtools` | [PR link](https://github.com/devtoolsd/awesome-devtools/pull/265) | ⏳ Awaiting review |
| — | `wong2/awesome-mcp-servers` | via mcpservers.org | ⏳ Awaiting review |

### ✅ Web Submissions (complete)

| Platform | Details |
|----------|---------|
| **LibHunt** | Edited project details (description, topics, language: Zig) at libhunt.com |
| **mcpservers.org** | Submitted SuperCLI MCP server entry — "Submission Successful!" |

### ✅ Strategy Document Created

**`marketing/GTM-LAUNCH-KIT.md`** — 5,000+ word comprehensive guide with:
- Positioning & messaging framework
- Target audience hooks (AI/agent devs, DevOps, indie hackers, enterprise)
- Channel-specific post templates (HN, Reddit, X/Twitter, LinkedIn, ProductHunt)
- 4-Week launch sequence (Seed → Launch → Amplify → Long-tail)
- Pre-written community posts (r/SideProject, r/devtools, X thread, Show HN)
- Awesome list submission guide with PR-ready descriptions
- Competitive positioning (vs oclif, zx, shell-gpt)
- Analytics tracking and distribution checklist
- README optimization and star growth tactics

---

## Core Messaging

### One-Liners
- "7,000 CLI tools. One command. Zero installs."
- "Learn one pattern (`ns res action`), access 7,000 tools."
- "The capability graph for every tool a developer or agent needs."

### Elevator Pitch (30s)
> "SuperCLI turns every CLI tool into a discoverable, predictable capability. Learn one pattern — `ns res action`. Every tool returns JSON by default, every tool self-describes via `inspect`. AI agents search, plan, and chain tools without glue code. 7,000+ plugins. Runs as a 250KB Zig binary or via `npx`."

### Target Audiences & Hooks

| Audience | Hook |
|----------|------|
| AI/Agent devs | "Your agent needs 7,000 tools. One command." |
| DevOps/Infra | "Stop installing 50 CLIs. One `npx` to rule them all." |
| Indie hackers | "Build faster. Skip the tooling tax." |
| Enterprise | "One capability graph. Every tool. Audit trail included." |

---

## GTM Workflow (for future sessions)

### Step 1: Refresh State
```bash
cd /home/jarancibia/ai/supercli

# Check catalog count
sc-zig plugins explore --json | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Plugins: {len(d)}')"

# Check PR status
gh pr list --repo agarrharr/awesome-cli-apps
gh pr list --repo alebcay/awesome-shell
gh pr list --repo e2b-dev/awesome-ai-agents
gh pr list --repo devtoolsd/awesome-devtools

# Check if there are new plugins worth announcing
git log --oneline --since="7 days ago" -- plugins/ | wc -l
```

### Step 2: Execute Outreach

**A) Awesome List PRs (using gh CLI — already authenticated as javimosch)**
```
# Fork → clone → add entry → commit → push → PR
gh repo fork <owner>/<repo> --clone
cd <repo>
# Add entry to README.md
git add README.md && git commit -m "Add supercli to <section>"
git push origin HEAD:main
gh pr create --repo <owner>/<repo> --head javimosch:main --title "Add supercli to <section>" --body "<body>"
```

**B) Browser submissions (using browser-use agent — Chrome installed)**
Navigate to submission forms, fill in details, submit.

**C) Social posts (if credentials available)**
Use sc plugins for posting if any are installed with auth:
- sc minipostiz-cli (if configured)
- Or use browser-use for web-based posting

### Step 3: Channels to Hit (Priority Order)

| Priority | Channel | Method | Auth Needed? |
|----------|---------|--------|-------------|
| ⭐⭐ | Awesome CLI Apps | PR | ✅ gh authed |
| ⭐⭐ | Awesome Shell | PR | ✅ gh authed |
| ⭐⭐ | Awesome AI Agents | PR | ✅ gh authed |
| ⭐⭐ | Awesome DevTools | PR | ✅ gh authed |
| ⭐⭐ | Awesome MCP Servers | Web form | ❌ |
| ⭐ | DevHunt / ProductHunt | Web form / browser | ❌ |
| ⭐ | LibHunt | Web edit | ❌ |
| ⭐ | StackShare | Web form | ❌ |
| ⭐ | AlternativeTo | Web form | ❌ |
| ⭐ | Reddit r/SideProject | browser-use | ❌ |
| ⭐ | Reddit r/devtools | browser-use | ❌ |

### Step 4: Track Results
```bash
# Check GitHub traffic
gh repo traffic --repo javimosch/supercli

# Check npm downloads (if published to npm)
npm view supercli downloads

# Check Google for mentions
# site:reddit.com supercli
# site:news.ycombinator.com supercli
# site:dev.to supercli
```

---

## Learnings & Intelligence

### What Works (Based on Experience)

| Channel | Method | Works? | Notes |
|---------|--------|--------|-------|
| GitHub PR (awesome lists) | `gh repo fork` + `gh pr create` | ✅ | Fastest method. 5 PRs in ~20min. gh CLI authed as javimosch. |
| mcpservers.org | browser-use web form | ✅ | "Submission Successful!" — no auth needed. |
| LibHunt | browser-use web form | ✅ | Edit page accessible — filled description, topics, language. |
| Reddit automated | browser-use | ⚠️ | Requires account. Not tested yet. |
| X/Twitter | Any | ❌ | No credentials available. Browser-use would need login. |
| minipostiz-cli | sc plugin | ⚠️ | Available but needs credential config. |

### Key Lessons

1. **gh CLI is the superpower** — authenticated as javimosch, can fork, commit, push, PR entirely via CLI. This is the fastest channel.
2. **Awesome lists accept submissions without being a maintainer** — each successful fork+PR creates a permanent backlink.
3. **Web forms work without auth** — mcpservers.org accepted submission without login.
4. **timing matters** — HN best posted between 9-11am ET. Reddit best Tuesday-Thursday.
5. **One-liner is critical** — awesome lists limit descriptions to ~120 chars. Keep descriptions tight.
6. **7,003 plugins (not 7,000)** — update number in all materials as catalog grows.

### Issues Found & Solutions

| Issue | Solution |
|-------|----------|
| `sc-zig` passthrough bug (`_ _` args forwarded literally) | Fixed in main.zig — `raw_argv[3..]` strips all 3 routing args |
| awesome-mcp-servers doesn't accept PRs | Used mcpservers.org web form instead |
| `sc skills search` namespace error | Skills plugin not installed — use `cat plugins/.../meta.json` or `sc-zig plugins explore` |

---

## Pre-Written Submit Templates

### Awesome List PR Description
```
Adds [supercli](https://github.com/javimosch/supercli) — [one-line description].

Fits the <section> section as it provides unified access to 7,000+ developer tools
through a single interface.
```

### NPM / Package Manager Description (120 chars max)
```
"Universal CLI router with 7,000+ plugins. One command pattern for every tool. JSON-by-default output, agent-native discovery."
```

### GitHub Topics
```
cli, cli-tool, developer-tools, ai-agents, mcp, command-line, terminal, devops, zig, nodejs, plugin-system, agent-native, json
```

---

## Future Opportunities (Not Yet Tried)

### More Awesome Lists

| List | URL | Method |
|------|-----|--------|
| awesome-cli | `uhub/awesome-cli` | PR |
| awesome-terminal | (defunct — skip) | ❌ |
| awesome-dev-tools | `awesome-dev-tools/awesome-dev-tools` | PR |
| awesome-tools-list | `noahbuscher/awesome-tools-list` | PR |
| awesome-developer-experience | `nicegui-dev/awesome-developer-experience` | PR |

### Dev Tool Directories (Web Forms)

| Platform | URL | Notes |
|----------|-----|-------|
| DevHunt | devhunt.co | Dev tools category |
| ProductHunt | producthunt.com | Needs account |
| StackShare | stackshare.io | Add tool page |
| AlternativeTo | alternativeto.net | Submit tool |
| Slant | slant.co | Community recommendations |
| OpenSourceAlternative | opensourcealternative.to | Add listing |

### Content Marketing
1. Write "What is a CLI Router?" blog post for dev.to / hashnode
2. Create asciicast/vhs terminal recording demo GIF
3. Write "SuperCLI vs oclif vs zx" comparison post
4. Create "7,000+ CLI tools, one interface" infographic
5. Record short demo video (screen.studio, loom)

### Community Building
1. GitHub Discussions — create "Show us your plugin" thread
2. Issue template — "Found via...?" attribution tracking
3. Weekly plugin spotlight (new plugins added each week)
4. Contributor onboarding guide for plugin authors

---

## Session Resume Checkpoint

When resuming GTM work in a new session:
1. Read this skill: `cat skills/supercli-gtm/SKILL.md`
2. Read the full strategy document: `marketing/GTM-LAUNCH-KIT.md`
3. Check current catalog count: `sc-zig plugins explore --json | wc -c`
4. Check PR statuses using URLs in "What's Been Done" section
5. Continue with "Future Opportunities" section above
