---
name: httpie
description: Use this skill when the user wants to make HTTP requests from the terminal — REST API testing, JSON payloads, auth headers, sessions, and pretty-printed responses.
---

# httpie Plugin

Modern HTTP client for the CLI. Human-friendly syntax for GET/POST/PUT/PATCH/DELETE with automatic JSON formatting, sessions, and download support.

## Installation

```bash
pip install httpie
# or
brew install httpie
# Debian/Ubuntu: apt install httpie
```

## Basic Usage

```bash
# GET request with pretty JSON output
http GET https://api.example.com/users

# POST JSON body
http POST https://api.example.com/users name=Alice email=alice@example.com

# Add headers and auth
http -a user:pass GET https://api.example.com/private

# Follow redirects
http --follow GET https://example.com
```

## Common Patterns

```bash
# Save and reuse a session (cookies, auth)
http --session=./session.json GET https://api.example.com/me

# Upload a file
http --form POST https://api.example.com/upload file@./photo.jpg

# Pipe JSON from stdin
echo '{"q":"search"}' | http POST https://api.example.com/search

# Download response body
http --download GET https://example.com/file.zip
```

## Usage Examples

- "Send a POST request with JSON to this API endpoint"
- "Test this REST endpoint with basic auth"
- "Pretty-print the response from a GET request"

## SuperCLI

```bash
sc httpie _ _ GET https://api.example.com/users
sc httpie _ _ POST https://api.example.com/users name=Bob
sc plugins learn httpie
```
