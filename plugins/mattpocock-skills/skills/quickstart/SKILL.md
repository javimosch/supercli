# mattpocock-skills Plugin

## Overview

Integrates [Matt Pocock's developer skills](https://github.com/mattpocock/skills) (55k+ ⭐) into supercli. These are curated, battle-tested engineering workflows for AI coding agents — not your average "write a function" prompts. They enforce real software engineering discipline.

## Installation

```bash
# Install the plugin via supercli
sc plugins install ./plugins/mattpocock-skills --on-conflict replace --json

# Install the skills themselves
sc mattpocock-skills self setup
```

The `self setup` command runs `npx skills@latest add mattpocock/skills` which presents an interactive menu. Select:
1. Your target AI coding agent (Claude Code, Cursor, etc.)
2. **Make sure to select `/setup-matt-pocock-skills`** — this is the core configuration skill

After installation, run `/setup-matt-pocock-skills` inside your agent to configure issue tracking, labels, and docs location.

## Available Commands

### Management Commands (via supercli)

| Command | Description |
|---|---|
| `sc mattpocock-skills self setup` | Install/configure skills via npx |
| `sc mattpocock-skills self list` | List installed skills |
| `sc mattpocock-skills self status` | Check which agents have skills installed |
| `sc mattpocock-skills self update` | Update to latest version |

### Skill Slash-Commands (inside Claude Code / Cursor)

Once installed, use these inside your AI coding agent:

| Command | Purpose |
|---|---|
| `/grill-me` | Deep interrogation of plans/designs — ensures alignment before coding |
| `/grill-with-docs` | Same as /grill-me but cross-references project docs (CONTEXT.md, ADRs) |
| `/diagnose` | Structured debugging workflow for bugs |
| `/improve-codebase-architecture` | Analyze and suggest architecture improvements |
| `/to-prd` | Convert conversation into a Product Requirements Document |
| `/to-issues` | Break PRD/plan into independent GitHub issues (vertical slices) |
| `/tdd` | Test-Driven Development — red-green-refactor cycle |
| `/zoom-out` | Get high-level context overview of the codebase |
| `/caveman` | Ultra-compressed communication mode |
| `/write-a-skill` | Create new skill templates |

## Usage Flow (Recommended)

1. **Plan first**: `/grill-me` or `/grill-with-docs` before writing code
2. **Document requirements**: `/to-prd` to capture what you're building
3. **Break it down**: `/to-issues` to create actionable tasks
4. **Build with quality**: `/tdd` for test-driven development
5. **Keep improving**: `/improve-codebase-architecture` periodically
6. **Debug systematically**: `/diagnose` when things break
7. **Stay aligned**: `/zoom-out` to keep the big picture in mind

## Tips

- Run `/setup-matt-pocock-skills` first — it configures your issue tracker, labels, and docs storage
- The skills work best when you have a `CONTEXT.md` file in your project root
- Use `/caveman` when you need maximum precision with minimum tokens
- Write your own custom skills with `/write-a-skill` to encode team-specific patterns
