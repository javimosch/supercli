---
name: howto
description: Use this skill when the user wants to find the right command for a task, get help with CLI usage, or translate a task description into a shell command.
---

# howto Plugin

Humble command-line assistant — describe a task and get a command suggestion.

## Commands

### Ask
- `howto ask suggest` — Describe a task and get a command suggestion

## Usage Examples
- "How do I curl headers only?"
- "What command works like diff but shows intersection?"
- "Find a command to compare two sorted files"

## Installation

```bash
go install github.com/nalgeon/howto@latest
```

Or:
```bash
brew tap nalgeon/howto https://github.com/nalgeon/howto
brew install howto
```

## Examples

```bash
# Ask for a command
howto curl example.org but print only the headers

# Follow-up questions
howto a command that works like diff
howto + yeah i need only the intersection

# Run the suggested command
howto -run
```

## Key Features
- Works with OpenAI, Ollama, and OpenAI-compatible providers
- Simple and non-intrusive
- Follow-up questions with +
- Run suggested commands directly
