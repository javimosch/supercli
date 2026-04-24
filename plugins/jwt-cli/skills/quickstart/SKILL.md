---
name: jwt-cli
description: Use this skill when the user wants to decode or encode JWT tokens, validate JWT signatures, or work with JSON Web Tokens from the command line.
---

# jwt-cli Plugin

A super fast CLI tool to decode and encode JWTs. Designed for hackers, with support for flexible output formats and pipe-friendly workflows.

## Commands

### Token Operations
- `jwt-cli token decode` — Decode a JWT token
- `jwt-cli token encode` — Encode a JWT token

### Utility
- `jwt-cli _ _` — Passthrough to jwt CLI

## Usage Examples
- "Decode JWT token"
- "Encode JWT token"
- "Validate JWT signature"
- "Inspect JWT payload"

## Installation

```bash
brew install mike-engel/tap/jwt-cli
```

Or via Cargo:
```bash
cargo install jwt-cli
```

## Examples

```bash
# Decode a token
jwt-cli token decode eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Decode with validation
jwt-cli token decode eyJhbG... --algorithm HS256 --secret mysecret

# Encode a token
jwt-cli token encode --algorithm HS256 --secret mysecret --issuer me --subject auth

# Output as JSON
jwt-cli token decode eyJhbG... --json

# Any jwt command with passthrough
jwt-cli _ _ decode eyJhbG...
jwt-cli _ _ encode --algorithm HS256 --secret key
```

## Key Features
- **Decode** - Decode JWT tokens
- **Encode** - Encode JWT tokens
- **Validate** - Signature validation
- **Algorithms** - Multiple algorithms
- **JSON** - JSON output
- **Pipes** - Pipe-friendly
- **Fast** - High performance
- **Flexible** - Flexible output
- **Claims** - Custom claims
- **Debug** - Debug tokens

## Notes
- Supports HS256, RS256, ES256, and more
- Pipe-friendly for scripting
- Great for API debugging
- Perfect for JWT automation
