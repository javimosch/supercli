# mr-pilot SuperCLI Plugin

AI-powered code review for GitLab Merge Requests and GitHub Pull Requests.

## Overview

This plugin wraps the [mr-pilot](https://github.com/javimosch/mr-pilot) CLI tool to provide automated code review capabilities through SuperCLI.

## Features

- **AI Code Review**: Analyze code changes using LLM (OpenRouter, OpenAI, Claude, etc.)
- **Scope Analysis**: Automatically determines what requirements are addressed by changes
- **Quality Scoring**: Provides 0-100 quality score with detailed issues
- **GitHub & GitLab Support**: Works with both platforms
- **Comment Posting**: Can post review comments directly to MRs/PRs

## Installation

```bash
npm i -g mr-pilot
# Configure .env with your tokens (see mr-pilot docs)
```

## Commands

### Preview Review

Review an MR without posting a comment:

```bash
supercli mrpilot review preview <mr_url_or_id> [options]
```

**Options:**
- `--platform <gitlab|github>` - Specify platform
- `-p, --project <path>` - GitLab project path
- `-i, --input-file <path>` - Ticket specification file
- `-g, --guidelines-file <path>` - Project guidelines
- `-m, --max-diff-chars <n>` - Max diff size (default: 50000)
- `-d, --debug` - Show debug info
- `--fail-on-truncate` - Exit if diff truncated

**Examples:**
```bash
# GitLab MR
supercli mrpilot review preview 1930 --project group/project -i criteria.txt

# GitHub PR
supercli mrpilot review preview https://github.com/owner/repo/pull/123
```

### Post Comment

Review and post comment to MR:

```bash
supercli mrpilot review comment <mr_url_or_id> [options]
```

Same options as preview, plus:
- `-a, --acceptance-criteria <text>` - Custom acceptance criteria

**Example:**
```bash
supercli mrpilot review comment 1930 \
  --project group/project \
  -i criteria.txt \
  -g guidelines.txt \
  --comment
```

### Validate Configuration

Check that mr-pilot is properly installed and configured:

```bash
supercli mrpilot config doctor
```

This checks:
- mr-pilot binary installed
- GITLAB_TOKEN / GITHUB_TOKEN set
- LLM API key configured
- Network connectivity

## Environment Setup

Create a `.env` file with required variables:

```bash
# GitLab (required for GitLab MRs)
GITLAB_TOKEN=glpat-xxxx
GITLAB_API=https://git.geored.fr/api/v4
GITLAB_DEFAULT_PROJECT=group/project

# GitHub (required for GitHub PRs)
GITHUB_TOKEN=ghp_xxxx

# LLM - Choose one:
OPENROUTER_API_KEY=sk-or-v1-xxxx  # Recommended
# or
OPENAI_API_KEY=sk-xxxx
# or
ANTHROPIC_API_KEY=sk-ant-xxxx

# Optional: Default model
OPENROUTER_MODEL=google/gemini-3-flash-preview
```

## Learn Content

AI agents can use the built-in skill:

```bash
supercli mrpilot learn
```

This loads quickstart instructions for using mr-pilot effectively.

## See Also

- [mr-pilot Repository](https://github.com/javimosch/mr-pilot)
- [mr-pilot Skill](~/.agents/skills/mr-pilot-usage/SKILL.md)