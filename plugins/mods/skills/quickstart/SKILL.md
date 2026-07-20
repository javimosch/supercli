---
name: mods
description: Use this skill when the user wants AI on the command line — ask questions, summarize files, generate code or text, or pipe command output through an LLM (OpenAI, Anthropic, Gemini, etc.).
---

# mods Plugin

AI on the command line from Charmbracelet. Pipe data in, get LLM responses out — great for summarizing logs, explaining code, or quick Q&A without leaving the terminal.

## Installation

```bash
brew install charmbracelet/tap/mods
# or
go install github.com/charmbracelet/mods@latest
```

## Setup

Set your provider and model (see [mods docs](https://github.com/charmbracelet/mods)):

```bash
export OPENAI_API_KEY=sk-...
export MODS_MODEL=gpt-4o
```

## Basic Usage

```bash
# Ask a question
mods "explain what a monad is in simple terms"

# Pipe file content
cat error.log | mods "summarize the errors and suggest fixes"

# Pipe git diff
git diff | mods "write a commit message for this diff"

# Interactive TUI mode
mods
```

## Usage Examples

- "Summarize this log file with AI"
- "Generate a commit message from my git diff"
- "Ask the LLM to explain this code snippet"

## SuperCLI

```bash
sc mods _ _ "what is grep?"
sc mods _ _ < README.md
sc plugins learn mods
```
