---
name: curlie
description: Use this skill when the user wants to make HTTP requests, test APIs, or debug web services with a user-friendly CLI.
---

# curlie Plugin

The power of curl, the ease of use of httpie. A command-line HTTP client with curl's power and httpie's user-friendly interface.

## Commands

### HTTP Requests
- `curlie http request` — Make HTTP request

### Utility
- `curlie _ _` — Passthrough to curlie CLI

## Usage Examples
- "Make HTTP request"
- "Test API endpoint"
- "Debug HTTP request"
- "Send POST request"

## Installation

```bash
brew install curlie
```

Or via Go:
```bash
go install github.com/rs/curlie/cmd/curlie@latest
```

## Examples

```bash
# GET request
curlie http request GET https://api.example.com

# POST request with data
curlie http request POST https://api.example.com --data '{"key":"value"}'

# Add custom header
curlie http request GET https://api.example.com --header "Authorization: Bearer token"

# Verbose output
curlie http request GET https://api.example.com --verbose

# Any curlie command with passthrough
curlie _ _ GET https://api.example.com
curlie _ _ POST https://api.example.com --data key=value
```

## Key Features
- **User-friendly** - Easy to use syntax
- **Curl power** - All curl features
- **HTTP methods** - GET, POST, PUT, DELETE, etc.
- **Headers** - Custom header support
- **Data** - Request body support
- **Verbose** - Detailed output
- **JSON** - JSON data support
- **API testing** - Great for API testing
- **Debugging** - HTTP debugging
- **Cross-platform** - Linux, macOS, Windows

## Notes
- Combines curl and httpie features
- Same power as curl, easier to use
- Perfect for API development
- Supports all HTTP methods
