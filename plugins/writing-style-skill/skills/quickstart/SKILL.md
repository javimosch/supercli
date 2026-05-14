---
name: writing-style-skill
description: Use this skill when the user wants to define, enforce, or auto-learn a writing style for AI-generated content — documentation, blog posts, code comments, or any text output.
---

# Writing Style Skill — Auto-Learning Style Template

Writing style skill template with built-in auto-learning. AI writes → you edit → rules auto-extracted → SKILL.md improves over time. Works with Claude Code + OpenClaw.

## Installation

```bash
git clone https://github.com/jzOcb/writing-style-skill.git
sc skills teach writing-style-skill:quickstart
```

## How It Works

```
AI writes draft using SKILL.md style rules → you edit to satisfaction → 
observe.py records original+final → improve.py extracts rules from diff → 
SKILL.md updated → next draft is better
```

## Workflow

1. Customize the SKILL.md with your writing style rules (or leave empty for auto-learning)
2. Have the AI write content using this skill
3. Edit the output until you're satisfied
4. Record the versions:
   ```bash
   python3 scripts/observe.py record-original draft.md
   # ... edit draft.md ...
   python3 scripts/observe.py record-final final.md
   ```
5. Extract and apply new rules:
   ```bash
   python3 scripts/improve.py auto --skill .
   ```

## Scripts

| Script | Purpose | Dependencies |
|--------|---------|-------------|
| `observe.py` | Record original/final versions | Zero (stdlib only) |
| `improve.py` | Extract rules from diff, update SKILL.md | Requires LLM CLI (claude or llm) |

## Features

- P0/P1/P2 confidence levels for extracted rules
- P0 rules auto-applied, P1/P2 proposed for review
- Automatic backup before each SKILL.md update
- One-command rollback
- LLM auto-detection: claude CLI > llm tool > IMPROVE_LLM_CMD env var

## Usage Prompts

- "Write a blog post about microservices using my writing style"
- "Generate API documentation following the style rules in SKILL.md"
- "Create a project README that matches my established writing voice"
- "I've edited the draft — extract new style rules from my changes"
