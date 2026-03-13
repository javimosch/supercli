# Aider Model And Provider Skill

Use this skill when an agent needs to confirm model/provider readiness before coding actions.

## Model Discovery

```bash
dcli aider models list --query sonnet
```

Use a targeted query (`sonnet`, `gpt-4o`, `deepseek`) to reduce output volume.

## Provider Preconditions

Aider requires provider credentials in environment variables, for example:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- other provider keys supported by aider

## Failure Handling

- If the wrapper reports provider or auth failures, stop and request credential fixes.
- Do not loop retries for static credential errors.
