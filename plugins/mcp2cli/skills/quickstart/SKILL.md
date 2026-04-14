---
name: mcp2cli
description: Use this skill when the user wants to convert MCP servers, OpenAPI specs, or GraphQL endpoints into CLI commands at runtime without code generation.
---

# mcp2cli Plugin

Turn any MCP server, OpenAPI spec, or GraphQL endpoint into a CLI — at runtime, with zero codegen.

## Commands

### Version
- `mcp2cli --version` — Print version

### Convert
- `mcp2cli convert` — Convert MCP server, OpenAPI spec, or GraphQL endpoint to CLI

### Serve
- `mcp2cli serve` — Serve MCP server as CLI

### List
- `mcp2cli list` — List available MCP servers and tools

## Usage Examples

```bash
# Convert an MCP server to CLI
mcp2cli convert --help

# Serve an MCP server as CLI
mcp2cli serve <server-uri>

# List available MCP servers
mcp2cli list

# Convert OpenAPI spec to CLI
mcp2cli convert --openapi ./spec.json

# Convert GraphQL endpoint to CLI
mcp2cli convert --graphql https://api.example.com/graphql
```

## Key Features
- Zero codegen — tools exposed at runtime
- Support for MCP servers, OpenAPI specs, and GraphQL endpoints
- Dynamic CLI generation
- Works with any MCP-compliant server

## Installation

```bash
uv tool install mcp2cli
```
