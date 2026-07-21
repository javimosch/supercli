---
name: aichat
description: Use this skill when the user wants to chat with LLMs from the terminal — OpenAI, Claude, Gemini, local models, RAG, and multi-turn conversations without leaving the shell.
---

# aichat Plugin

All-in-one LLM CLI. Chat with multiple providers, run one-shot prompts, manage sessions, and pipe shell output into AI workflows.

## Installation

```bash
cargo install aichat
# or download from https://github.com/sigoden/aichat/releases
```

Configure API keys in `~/.config/aichat/config.yaml` or via environment variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.).

## Basic Usage

```bash
# Interactive chat session
aichat

# One-shot prompt
aichat "Explain this error: connection refused on port 5432"

# Specify model and role
aichat --model gpt-4o "Summarize this README"

# Pipe command output into a prompt
git diff | aichat "Review these changes for bugs"
```

## Common Patterns

```bash
# Use a system role / preset
aichat --role coder "Refactor this function for clarity"

# RAG over local files
aichat --rag ./docs "How do I configure authentication?"

# Execute generated shell commands (use with care)
aichat --execute "List large files in /tmp"

# Session history
aichat --session project-alpha
```

## Usage Examples

- "Ask Claude to explain this stack trace"
- "Chat interactively with GPT-4 in the terminal"
- "Summarize the output of this git log"

## SuperCLI

```bash
sc aichat _ _ "What does this regex match?"
sc aichat _ _ --model claude-3-5-sonnet "Draft a commit message"
sc plugins learn aichat
```
