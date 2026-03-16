---
skill_name: "pplx_usage"
description: "Teaches agents how to use the Perplexity API CLI for online search, research, and Q&A with citations."
command: "sc skills get pplx.usage"
tags: ["perplexity", "ai", "search", "research", "llm", "citations", "online"]
---

# pplx Usage Skill

Use this skill when you need real-time information, research with citations, or online search capabilities through the Perplexity API.

## 1) Learn and Install

```bash
# Learn about the plugin
sc plugins learn pplx

# Install the plugin
sc plugins install pplx
```

## 2) Configure API Key

```bash
# Set environment variable (recommended)
export PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxxxx

# Or use --api-key flag with each command
sc pplx chat send "Question" --api-key pplx-xxx
```

Get API key: https://www.perplexity.ai/settings/api

## 3) Validate Setup

```bash
# Check version
sc pplx _ version

# List available models
sc pplx models list --json
```

## 4) Common Workflows

### Quick Question
```bash
sc pplx ask send "What is quantum computing?" --json
```

### Research with Citations
```bash
sc pplx chat send "Latest developments in AI regulation 2025" --citations --json
```

### Deep Research
```bash
sc pplx chat send "Comprehensive analysis of renewable energy trends" \
  --model sonar-deep-research \
  --citations \
  --related-questions \
  --search-queries \
  --json
```

### List Models
```bash
sc pplx models list --json
```

### Get Help Schema
```bash
sc pplx help json
```

## 5) Available Models

| Model | Use Case |
|-------|----------|
| `sonar` | Fast online search |
| `sonar-pro` | Advanced online search |
| `sonar-deep-research` | Deep research with citations |
| `sonar-reasoning` | Reasoning with search |
| `sonar-reasoning-pro` | Advanced reasoning |

## 6) Error Handling

Exit codes for agent decision-making:

| Code | Type | Action |
|------|------|--------|
| 0 | success | Parse response |
| 85 | missing_api_key | Set PERPLEXITY_API_KEY |
| 87 | authentication_failed | Check API key validity |
| 106 | rate_limited | Wait 60s and retry |
| 105 | timeout | Retry immediately |

## 7) Passthrough Mode

Use passthrough for advanced options:

```bash
sc pplx _ chat "Question" --model sonar-pro --temperature 0.7 --max-tokens 500
```

## 8) Remote Skill Sync

This plugin syncs skills from the remote repository:

```bash
# Skills are auto-synced from https://github.com/javimosch/pplx
# Manual sync if needed:
sc skills sync pplx
```

## Caveats

- Always use `--json` for programmatic parsing
- API key required (env var or --api-key flag)
- Rate limits apply (exit code 106)
- Prefer `sonar-deep-research` for academic/research tasks
