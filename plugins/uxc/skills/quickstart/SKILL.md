---
name: uxc
description: Use this skill when the user wants to call APIs across different protocols (OpenAPI, GraphQL, gRPC, MCP), discover API operations, or unify API tooling.
---

# uxc Plugin

One CLI for tools across protocols — OpenAPI, MCP, GraphQL, gRPC, JSON-RPC.

## Commands

### Discover
- `uxc host discover` — Discover operations on a host

### Invoke
- `uxc invoke` — Call an API operation

## Usage Examples
- "Discover what a host exposes"
- "Call a GraphQL API"
- "Invoke an OpenAPI operation"

## Installation

```bash
brew install holon-run/tap/uxc
```

Or:
```bash
curl -fsSL https://raw.githubusercontent.com/holon-run/uxc/main/scripts/install.sh | bash
```

## Examples

```bash
# Discover OpenAPI
uxc petstore3.swagger.io/api/v3 -h
uxc petstore3.swagger.io/api/v3 get:/pet/{petId} -h

# Call operation
uxc petstore3.swagger.io/api/v3 get:/pet/{petId} petId=1

# GraphQL
uxc countries.trevorblades.com -h
uxc countries.trevorblades.com query/country code=US

# MCP
uxc mcp.deepwiki.com/mcp -h
```

## Key Features
- Help-first discovery
- Key/value or JSON arguments
- JSON-first output
- Reusable auth credentials
- MCP-first config import
- Daemon-backed session reuse
