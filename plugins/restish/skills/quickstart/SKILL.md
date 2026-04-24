---
name: restish
description: Use this skill when the user wants to interact with REST APIs, send HTTP requests, or test API endpoints from the command line with schema-aware completion.
---

# restish Plugin

CLI for interacting with REST-ish APIs. A user-friendly HTTP client with built-in API schema discovery, JSON navigation, and convenient resource management.

## Commands

### API Requests
- `restish api get` — Send GET request to API
- `restish api post` — Send POST request to API

### Utility
- `restish _ _` — Passthrough to restish CLI

## Usage Examples
- "Send GET request to API"
- "POST data to endpoint"
- "Test REST API"
- "API client from CLI"

## Installation

```bash
brew install restish
```

Or via Go:
```bash
go install github.com/rest-sh/restish@latest
```

## Examples

```bash
# GET request
restish api get https://api.example.com/users

# GET with query params
restish api get /users --query page=1 --query limit=10

# POST request
restish api post /users --body '{"name":"John"}'

# With custom headers
restish api get /users --header "Authorization: Bearer token"

# Any restish command with passthrough
restish _ _ get https://api.example.com
curl _ _ post /items --body '{"key":"value"}'
```

## Key Features
- **Schema** - OpenAPI discovery
- **Auto-complete** - Shell completion
- **JSON** - JSON navigation
- **Resources** - Resource management
- **Auth** - Authentication helpers
- **Headers** - Custom headers
- **History** - Request history
- **Export** - Export to curl
- **Pretty** - Pretty printing
- **Colors** - Syntax highlighting

## Notes
- Supports OpenAPI schemas
- Great for API exploration
- Shell auto-completion
- Human-friendly output
