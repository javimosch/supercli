---
name: codefetch
description: Use this skill when the user wants to serialize a codebase into AI-friendly Markdown, count tokens for LLM context windows, fetch GitHub repos, or prepare code for ChatGPT/Claude/Gemini analysis.
---

# Codefetch Plugin

Turn codebases and repos into structured Markdown optimized for LLMs. Smart filtering, token counting, project tree views, and one-click AI chat integration.

## Commands

### Self
- `codefetch self version` — Print codefetch version

### Codebase
- `codefetch codebase process` — Process local codebase into Markdown (use `--dir`, `-e`, `--max-tokens`, etc.)
- `codefetch codebase open` — Process codebase, copy to clipboard, and open ChatGPT/Claude/Gemini
- `codefetch codebase url` — Fetch a GitHub repo or website URL into Markdown

### Project
- `codefetch project init` — Initialize codefetch config (.codefetchignore, codefetch.config.mjs)

### Passthrough
- `codefetch _ _` — Direct passthrough for any codefetch command (token counting, dry-run, etc.)

## Usage Examples
- "Serialize this codebase into a markdown file for LLM analysis"
- "Fetch the React repo and prepare it for Claude"
- "Count tokens in the TypeScript files and open in ChatGPT"
- "Generate a project tree view up to depth 3"
- "Crawl this website's docs pages into markdown"

## Installation

```bash
npm install -g codefetch
```

## Examples

```bash
# Basic: serialize current directory
codefetch

# With extensions and tree view
codefetch -e ts,tsx -t 3

# Limit tokens
codefetch --max-tokens 50000

# Fetch GitHub repo (no git clone needed)
codefetch --url github.com/facebook/react

# Fetch repo with specific branch and extensions
codefetch --url github.com/vuejs/vue --branch main -e js,ts

# Copy to clipboard and open ChatGPT
codefetch open

# Open in Claude instead
codefetch open --chat-url claude.ai --chat-model claude-3.5-sonnet

# Dry run to stdout
codefetch -d

# Count tokens only
codefetch -c --token-encoder cl100k

# Add a prompt
codefetch -p improve

# Crawl website docs
codefetch --url example.com/docs --max-pages 50 --max-depth 3

# Specify output file
codefetch -o my-codebase.md
```

## Key Features
- Structured XML output (`<task>`, `<filetree>`, `<source_code>`) optimized for AI models
- Respects `.gitignore` and custom `.codefetchignore` patterns
- Token counting for GPT-4 (cl100k), GPT-4o (o200k), GPT-3 (p50k)
- GitHub API fetching (no git clone needed)
- Web crawling with depth and page limits
- Project tree visualization
- One-click `open` to ChatGPT, Claude, or Gemini
- Prompt templates: fix, improve, codegen, testgen
