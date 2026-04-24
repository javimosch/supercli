---
name: reviewdog
description: Use this skill when the user wants to run automated code review, integrate linters with PR reviews, or perform static analysis on code.
---

# reviewdog Plugin

Automated code review tool integrated with any code analysis tools regardless of programming language. Post review comments to pull requests with diff filtering.

## Commands

### Code Review
- `reviewdog code review` — Run code review on project

### Utility
- `reviewdog _ _` — Passthrough to reviewdog CLI

## Usage Examples
- "Run code review on this project"
- "Review pull request changes"
- "Check for code issues"
- "Integrate linter with PR review"

## Installation

```bash
brew install reviewdog
```

Or via Go:
```bash
go install github.com/reviewdog/reviewdog/cmd/reviewdog@latest
```

## Examples

```bash
# Run with GitHub PR checks
reviewdog code review --reporter github-pr-check

# Run with GitHub checks
reviewdog code review --reporter github-check

# Local reporter (print to stdout)
reviewdog code review --reporter local

# Filter by added lines
reviewdog code review --filter added

# Filter by diff context
reviewdog code review --filter diff_context

# Filter by file
reviewdog code review --filter file

# No filter (all lines)
reviewdog code review --filter nofilter

# Fail on errors
reviewdog code review --fail-on-error

# Set report level
reviewdog code review --level error

# Use config file
reviewdog code review --conf .reviewdog.yml

# Also print to stdout
reviewdog code review --tee

# Any reviewdog command with passthrough
reviewdog _ _ --reporter github-pr-check --filter added
reviewdog _ _ --conf .reviewdog.yml --tee
```

## Key Features
- **Language agnostic** - Works with any programming language
- **Multiple reporters** - GitHub, GitLab, Bitbucket, local
- **Diff filtering** - Only review changed lines
- **Linter integration** - Supports any static analysis tool
- **CI integration** - GitHub Actions, Travis CI, Circle CI, GitLab CI
- **Configurable** - YAML config file support
- **Error formats** - Supports various linter error formats
- **SARIF support** - Standard Analysis Result Format
- **Code suggestions** - Automatic fix suggestions
- **Multiple reporters** - Can report to multiple platforms

## Notes
- Requires CI environment for PR reporters
- Diff filtering only reviews changed lines
- Can be used in CI pipelines
- Supports custom error formats
- Config file at .reviewdog.yml
- Perfect for enforcing code quality
