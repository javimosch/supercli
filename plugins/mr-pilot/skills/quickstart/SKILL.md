---
name: mr-pilot
description: Use this skill when the user wants to perform AI-powered code review on GitLab Merge Requests or GitHub Pull Requests.
---

# mr-pilot Plugin

AI-powered code review for GitLab Merge Requests and GitHub Pull Requests. Get instant feedback on bugs, quality, and requirements using LLMs like OpenAI, Ollama, Claude, and more.

## Commands

### Review by URL
- `mr-pilot review url` — Review MR/PR by full GitLab or GitHub URL

### Review by ID
- `mr-pilot review id` — Review MR/PR by numeric ID with project specification

### Review with Input File
- `mr-pilot review with-input` — Review MR/PR with ticket specification file

### Review with Guidelines
- `mr-pilot review with-guidelines` — Review MR/PR with project guidelines to reduce false positives

### Review and Comment
- `mr-pilot review comment` — Review MR/PR and post as comment

### Debug Mode
- `mr-pilot review debug` — Review MR/PR in debug mode (show what's sent to LLM)

### Custom Diff Size
- `mr-pilot review max-diff` — Review MR/PR with custom diff size limit for large changesets

### Passthrough
- `mr-pilot _ _` — Passthrough to mr-pilot CLI

## Usage Examples

### GitLab
```bash
# Review by full MR URL
mr-pilot review url "https://gitlab.com/MyOrg/MyGroup/MyProject/-/merge_requests/1763"

# Review by MR ID with project
mr-pilot review id 1763 --project "RD_soft/simpliciti-frontend/geored-v3"

# Review by MR ID using default project (set in .env)
mr-pilot review id 1763
```

### GitHub
```bash
# Review by full PR URL
mr-pilot review url "https://github.com/owner/repo/pull/123"

# Review by PR number with repository
mr-pilot review id 123 --project "owner/repo"

# Review by PR number using default repository (set in .env)
mr-pilot review id 123
```

### With Options
```bash
# Review with ticket specification file
mr-pilot review with-input 1763 --input-file input.txt

# Review with project guidelines
mr-pilot review with-guidelines 1763 --guidelines-file guidelines.txt

# Review and post as comment
mr-pilot review comment 1763 --project "owner/repo"

# Review in debug mode
mr-pilot review debug 1763 --input-file input.txt

# Review with custom diff size for large MRs
mr-pilot review max-diff 1763 --max-diff-chars 75000

# Combine all options
mr-pilot review url "https://github.com/owner/repo/pull/123" \
  --input-file input.txt \
  --guidelines-file guidelines.txt \
  --comment \
  --debug \
  --max-diff-chars 100000
```

## Installation

```bash
npm install -g mr-pilot
```

Configure environment variables in `.env`:

**For GitLab:**
- `GITLAB_TOKEN`: Your GitLab personal access token (with api scope)
- `GITLAB_API`: Your GitLab API URL (e.g., https://gitlab.com/api/v4)
- `GITLAB_DEFAULT_PROJECT`: (Optional) Default project path for using MR ID only

**For GitHub:**
- `GITHUB_TOKEN`: Your GitHub personal access token (with repo scope)
- `GITHUB_DEFAULT_REPO`: (Optional) Default repository for using PR number only

**LLM Configuration:**
- `LLM_PROVIDER`: LLM provider (openrouter, openai, ollama, azure)
- `LLM_API_KEY`: Your LLM API key (not needed for Ollama)
- `LLM_MODEL`: Model to use (e.g., openai/gpt-4o, llama3.1:8b)

## Key Features

- **Platform Auto-Detection**: Automatically detects GitLab vs GitHub based on URL structure
- **Multiple LLM Support**: Works with OpenAI, Ollama, Claude, OpenRouter, Azure OpenAI
- **Custom Guidelines**: Reduce false positives by providing project-specific guidelines
- **Ticket Context**: Include ticket specifications for targeted reviews
- **Debug Mode**: See exactly what's sent to the LLM for troubleshooting
- **Large MR Support**: Adjust diff size limits for reviewing large changesets
- **Comment Posting**: Automatically post reviews as MR/PR comments
- **CI/CD Integration**: Useful in CI/CD pipelines with exit code 1 on issues

## Platform Auto-Detection Rules

- 2-segment paths (e.g., `owner/repo`) → Auto-selects GitHub
- 3+ segment paths (e.g., `group/subgroup/project`) → Auto-selects GitLab
- Priority: `--project` argument > `GITHUB_DEFAULT_REPO` > `GITLAB_DEFAULT_PROJECT`
- Override anytime with `--platform gitlab` or `--platform github`
