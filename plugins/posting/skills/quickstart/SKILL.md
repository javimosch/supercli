---
name: posting
description: Use this skill when the user wants to make HTTP requests, test APIs, or manage API collections from a terminal TUI.
---

# posting Plugin

posting — TUI HTTP client for exploring and testing APIs from the terminal. A keyboard-driven interface with request collections, environment variables, and syntax-highlighted responses.

## Commands

### Interface
- `posting ui open` — Open the posting TUI interface

### Utility
- `posting _ _` — Passthrough to posting CLI

## Usage Examples
- "Open the API client"
- "Test this REST endpoint interactively"
- "Open posting with my collection"
- "Make HTTP requests from the terminal"

## Installation

```bash
pipx install posting
```

Or via pip:
```bash
pip install posting
```

Requires Python 3.11+.

## Examples

```bash
# Open posting TUI
posting ui open

# Open with a specific collection
posting ui open --collection ./my-api-collection

# Load environment variables
posting ui open --env .env.local

# Open with collection and env
posting ui open --collection ./apis --env production.env

# Any posting command with passthrough
posting _ _ --help
posting _ _ --version
```

## Key Features
- **TUI interface** — Full-featured terminal UI built with Textual
- **Collections** — Organize requests in YAML files and directories
- **Environments** — Switch between environments with .env files
- **Syntax highlighting** — Colored JSON, XML, and HTML responses
- **Keyboard driven** — Navigate entirely with keyboard shortcuts
- **Variables** — Reference env vars in URLs, headers, and bodies
- **Methods** — GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **Auth** — Bearer token, Basic auth, and custom headers

## Notes
- Collections are stored as human-readable YAML files
- Each request is a `.yaml` file inside the collection directory
- Supports dotenv-style environment files
- Responses include headers, status, and formatted body
- Great alternative to Postman or Insomnia for terminal users
