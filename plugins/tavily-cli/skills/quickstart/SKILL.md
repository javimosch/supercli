---
name: tavily-cli
description: Use this skill when the user wants to search the web, extract content from URLs, crawl sites, or run deep research across multiple sources from the terminal.
---

# Tavily CLI

Native web access for agents from the terminal. Search, extract, crawl, and research with structured output designed for agent workflows.

## Commands

- `tavily-cli search web` — Search the web
- `tavily-cli extract url` — Extract content from a URL
- `tavily-cli research deep` — Deep multi-source research
- `tavily-cli _ _` — Passthrough to tvly CLI

## Installation

```bash
curl -fsSL https://cli.tavily.com/install.sh | sh
```

## Authentication

```bash
tvly login
```

## Usage Examples

- "Search for latest AI agent developments"
- "Extract content from this URL"
- "Research competitive landscape of AI code assistants"
- "Crawl a documentation site"

## Key Commands

```bash
# Search
tvly search "latest AI agents developments" --json

# Extract page content
tvly extract "https://docs.example.com/api" --json

# Crawl with objective
tvly crawl "https://docs.example.com" --objective "find API docs"

# Deep research
tvly research "AI code assistant landscape" --json
```

## Key Features
- **Web Search** - LLM-optimized results
- **Extract** - Pull content from URLs
- **Crawl** - Site crawling with objectives
- **Research** - Multi-source deep dive
- **JSON Output** - Structured for agents
