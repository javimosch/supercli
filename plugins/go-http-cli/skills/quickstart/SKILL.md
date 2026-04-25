---
name: go-http-cli
description: Use this skill when the user wants to make HTTP requests, test APIs, or use a cURL alternative.
---

# go-http-cli Plugin

A powerful HTTP CLI client written in Go. cURL alternative with profiles, variables, and named requests.

## Commands

### HTTP Requests
- `go-http-cli request http` — Make HTTP request

### Utility
- `go-http-cli _ _` — Passthrough to http CLI

## Usage Examples
- "Make HTTP GET request"
- "Test this API endpoint"
- "POST data to URL"
- "Use HTTP client with headers"

## Installation

Download from GitHub releases:
```bash
# Download for your platform from:
# https://github.com/visola/go-http-cli/releases

# Unzip and add to PATH
export PATH=$PATH:/path/to/extracted/root
```

## Examples

```bash
# GET request
go-http-cli request http https://httpbin.org/get

# POST with JSON
go-http-cli request http https://httpbin.org/post -X POST -d '{"name": "John"}'

# With headers
go-http-cli request http https://api.example.com -H "Content-Type: application/json"

# Query parameters
go-http-cli request http https://httpbin.org/get key=value

# POST with form data
go-http-cli request http https://httpbin.org/post -X POST name=John

# Any http command with passthrough
go-http-cli _ _ https://api.example.com -X GET
go-http-cli _ _ https://api.example.com -H "Authorization: Bearer token"
```

## Key Features
- **cURL-like** - Familiar cURL syntax
- **Profiles** - YAML configuration files
- **Variables** - Reusable variables
- **Named requests** - Save and reuse requests
- **Auto JSON** - Automatically build JSON
- **URL encoding** - Automatic query string encoding
- **Authentication** - Multiple auth methods
- **Completion** - Bash and zsh auto-completion

## Notes
- Profiles stored in ~/.go-http-cli/
- Use +profileName to activate profile
- Can use environment variables
- Great for API testing
- More user-friendly than cURL
