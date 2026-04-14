---
name: diny
description: Use this skill when the user wants to generate meaningful git commit messages from their staged changes using AI.
---

# diny Plugin

Generate AI git commit messages from your changes.

## Commands

### Commit
- `diny commit generate` — Generate a commit message

## Usage Examples
- "Generate a commit message for staged changes"
- "Create a conventional commit message"

## Installation

```bash
go install github.com/dinoDanic/diny@latest
```

## Examples

```bash
# Stage some changes
git add .

# Generate commit message
diny

# Or pipe to git commit
diny | git commit -F -
```

## Key Features
- AI-powered message generation
- Analyzes staged changes
- Meaningful commit messages
- Works with any AI provider
