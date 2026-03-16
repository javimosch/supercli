# pplx Plugin

Perplexity API CLI plugin for SuperCLI - Fast, non-interactive, agent-first CLI for online search and research with citations.

## Source

- **CLI Repository**: https://github.com/javimosch/pplx
- **Skill Sync**: Auto-syncs from `.agents/skills/pplx-usage/SKILL.md`

## Installation

```bash
# Learn about the plugin
sc plugins learn pplx

# Install from registry
sc plugins install pplx
```

## Configuration

Set your Perplexity API key:

```bash
export PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxxxx
```

Or use `--api-key` flag with each command.

Get API key: https://www.perplexity.ai/settings/api

## Commands

| Command | Description |
|---------|-------------|
| `sc pplx chat send <message>` | Send a chat completion request |
| `sc pplx ask send <question>` | Ask a question (simplified chat) |
| `sc pplx models list` | List available Perplexity models |
| `sc pplx help json` | Get machine-readable help schema |
| `sc pplx _ <any>` | Passthrough for any pplx command |

## Examples

```bash
# Quick question
sc pplx ask send "What is quantum computing?" --json

# Research with citations
sc pplx chat send "Latest AI developments 2025" --citations --json

# Deep research
sc pplx chat send "Climate change research" \
  --model sonar-deep-research \
  --citations \
  --related-questions \
  --json

# List models
sc pplx models list --json

# Passthrough mode
sc pplx _ chat "Question" --model sonar-pro --temperature 0.7
```

## Available Models

- `sonar` - Fast online search
- `sonar-pro` - Advanced online search
- `sonar-deep-research` - Deep research with citations
- `sonar-reasoning` - Reasoning with search
- `sonar-reasoning-pro` - Advanced reasoning

## Error Handling

| Exit Code | Type | Action |
|-----------|------|--------|
| 0 | success | Parse response |
| 85 | missing_api_key | Set PERPLEXITY_API_KEY |
| 87 | authentication_failed | Check API key |
| 106 | rate_limited | Wait 60s and retry |
| 105 | timeout | Retry immediately |

## Skills

This plugin includes learn skills:

```bash
sc plugins learn pplx
```

Skills are synced from the remote repository automatically.

## License

MIT
