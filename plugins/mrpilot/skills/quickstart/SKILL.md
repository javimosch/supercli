---
name: mrpilot-quickstart
description: Use mr-pilot CLI to perform AI code reviews on GitLab MRs and GitHub PRs. Invoke when user requests code review, merge request analysis, or automated feedback on PRs.
compatibility: Requires mr-pilot CLI installed (npm i -g mr-pilot) and environment variables configured
metadata:
  plugin: mrpilot
  version: "1.2.0"
---

# mr-pilot Quickstart

Quick reference for AI agents using the mrpilot plugin.

## When to Use

Invoke this skill when user asks to:
- Review a GitLab MR or GitHub PR
- Analyze code changes
- Get AI feedback on merge request
- Post automated review comment

## Command Patterns

### Preview (no comment posted)

```
supercli mrpilot review preview <mr_id_or_url> [options]
```

### Review with Comment

```
supercli mrpilot review comment <mr_id_or_url> [options]
```

## Common Options

| Option | Description |
|--------|-------------|
| `--platform gitlab\|github` | Specify platform |
| `-p <project>` | GitLab project path |
| `-i <file>` | Ticket specification |
| `-g <file>` | Project guidelines |
| `-m <n>` | Max diff chars |
| `-d` | Debug mode |
| `-a <text>` | Acceptance criteria |

## Examples

**GitLab MR review with ticket:**
```
supercli mrpilot review comment 1930 --project mygroup/myproject -i criteria.txt
```

**GitHub PR preview:**
```
supercli mrpilot review preview https://github.com/owner/repo/pull/456
```

**Large MR:**
```
supercli mrpilot review preview 1930 -m 200000 --comment
```

## Configuration Check

Before running reviews, verify setup:
```
supercli mrpilot config doctor
```

## Environment Variables

Ensure these are set in user's environment:
- `GITLAB_TOKEN` (for GitLab MRs)
- `GITHUB_TOKEN` (for GitHub PRs)
- LLM API key: `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, or `ANTHROPIC_API_KEY`