---
name: commiat
description: Use this skill when the user wants to generate AI-assisted git commit messages.
---

# Commiat Plugin

AI-assisted git commit message plugin that generates meaningful commit messages using AI.

## Commands

### Commit Message Generation
- `commiat _ _` — Generate AI commit message for current git changes (passthrough)

## Usage Examples
- "commiat" — Generate commit message for staged changes
- "commiat --model gpt-4" — Use specific AI model
- "commiat --context" — Include additional context in prompt

## Installation

```bash
npm install -g commiat
```

## Examples

```bash
# Generate commit message for staged changes
commiat

# Generate with specific AI model
commiat --model gpt-4

# Generate with custom context
commiat --context "Fix authentication bug"

# Generate for unstaged changes
commiat --unstaged

# Dry run (show message without committing)
commiat --dry-run

# Use custom API key
commiat --api-key YOUR_KEY
```

## Key Features
- AI-powered commit message generation
- Supports multiple AI models
- Custom context injection
- Dry-run mode for preview
- Works with staged or unstaged changes
- Configurable API keys

## Workflow
1. Stage your changes: `git add .`
2. Run commiat: `commiat`
3. Review the generated commit message
4. Commit if satisfied, or edit and commit manually
