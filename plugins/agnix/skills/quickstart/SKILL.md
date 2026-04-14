---
name: agnix
description: Use this skill when the user wants to validate AI coding assistant configurations, lint agent config files (CLAUDE.md, SKILL.md, AGENTS.md), or fix configuration issues.
---

# Agnix Plugin

The missing linter and LSP for AI coding assistants. Validates CLAUDE.md, AGENTS.md, SKILL.md, hooks, MCP configs.

## Commands

### Linting
- `agnix lint validate` — Validate agent configuration files

## Usage Examples

Basic validation:
```
agnix .
agnix --target claude-code .
```

Apply fixes:
```
agnix --fix .
agnix --fix-safe .
agnix --fix-unsafe .
```

Preview fixes:
```
agnix --dry-run --show-fixes .
```

Strict mode:
```
agnix --strict .
```

## Installation

```bash
npm install -g agnix
```

Or via Homebrew:
```bash
brew tap agent-sh/agnix && brew install agnix
```

## Supported Tools
- Claude Code (53 rules)
- Kiro (51 rules)
- Agent Skills (31 rules)
- Cursor (16 rules)
- MCP (12 rules)
- GitHub Copilot (6 rules)
- Gemini CLI (9 rules)
- Cline (4 rules)
- AGENTS.md (13 rules)

## Key Features
- 385 validation rules across major AI coding assistants
- Auto-fix support with confidence levels
- CI/CD integration via GitHub Action
- Editor plugins (VS Code, JetBrains, Neovim, Zed)
- Supports CLAUDE.md, AGENTS.md, SKILL.md, hooks, MCP configs