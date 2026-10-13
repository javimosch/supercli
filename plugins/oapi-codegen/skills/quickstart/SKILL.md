---
name: oapi-codegen
description: Use this skill when the user wants to generate Go server stubs, clients, or types from an OpenAPI 3 spec with oapi-codegen.
---

# oapi-codegen Plugin

oapi-codegen turns an OpenAPI 3 spec into Go code: model types, server interfaces
(chi, echo, gin, fiber, std lib), strict handlers, client code, and embedded-spec
helpers. The config-file mode is the recommended way to wire it into a repo.

## Commands

### Generation
- `oapi-codegen spec generate <spec>` — Generate via CLI flags
- `oapi-codegen config generate <cfg> <spec>` — Generate via config file
- `oapi-codegen templates list` — Show targets/options
- `oapi-codegen _ _` — Passthrough

## Usage Examples

- "Generate a chi server from this OpenAPI spec"
- "Generate just the model types"
- "Set up oapi-codegen config for this repo"
- "Generate a typed API client"

## Installation

```bash
go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest
```

## Examples

```bash
# Types only
oapi-codegen -generate types -o api/types.gen.go openapi.yaml

# Chi server + types
oapi-codegen -generate types,chi-server -o api/server.gen.go openapi.yaml

# Client
oapi-codegen -generate types,client -o api/client.gen.go openapi.yaml

# Config file (checked into repo, used via go:generate)
# cfg.yaml: package, output, generate: {chi-server: true, strict-server: true, models: true}
oapi-codegen --config cfg.yaml openapi.yaml
```

## Key Features

- Targets: types, chi-server, echo-server, gin, fiber, std-http-server, strict-server, client, client-with-responses, embedded-spec, spec, skip-fmt, skip-prune
- Config-file mode records all options for reproducible `go generate`
- `strict-server` wraps handlers with automatic request decoding/validation
- Supports spec embedding (`-generate embedded-spec`) for runtime validation
