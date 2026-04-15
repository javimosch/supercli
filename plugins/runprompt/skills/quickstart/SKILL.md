---
name: runprompt
description: Use this skill when the user wants to run LLM prompts from .prompt files in the shell.
---

# Runprompt Plugin

Run LLM [.prompt](https://google.github.io/dotprompt/) files from your shell with a single-file Python script.

## Commands

### Version
- `supercli runprompt self version` — Print runprompt version

### Run Prompt
- `supercli runprompt prompt run <prompt_file> [variables]` — Run a .prompt file with template variables

### Passthrough
- `supercli runprompt -- <args>` — Pass through to runprompt CLI

## Usage Examples

```bash
# Run a prompt file with variables
./runprompt hello.prompt '{"name": "World"}'

# Pass variables via stdin
echo '{"name": "World"}' | ./runprompt hello.prompt

# Use with other providers
export OPENAI_API_KEY="your-key"
./runprompt --model openai/gpt-4o hello.prompt

# Interactive chat mode
./runprompt --chat expert.prompt
```

## Installation

```bash
pip install runprompt
```

## Key Features

- Dotprompt template format support
- Multiple LLM providers (Anthropic, OpenAI, Google AI, OpenRouter)
- Structured JSON output with Picoschema
- Shell tool execution before prompts
- File attachments and glob patterns
- Response caching
