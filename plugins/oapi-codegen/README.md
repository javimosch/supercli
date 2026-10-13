# oapi-codegen Plugin for SuperCLI

[oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) generates Go code from
OpenAPI 3 specs: type-safe request/response structs, server interfaces for
chi/echo/gin/stdlib, strict handlers, lockdown clients, and embedded spec loading —
keeping the API contract and implementation in sync.

## Installation

```bash
# Install oapi-codegen binary
go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest

# Install supercli plugin
supercli plugins install ./plugins/oapi-codegen
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli oapi-codegen self version` | Show version |
| `supercli oapi-codegen spec generate <spec>` | Generate Go code from spec |
| `supercli oapi-codegen config generate <cfg> <spec>` | Generate via config file |
| `supercli oapi-codegen templates list` | Show generate targets/help |
| `supercli oapi-codegen <any>` | Passthrough to CLI |

## Usage

```bash
# Types + chi server
supercli oapi-codegen spec generate api.yaml -generate types,chi-server -o api/gen.go

# Via config file (recommended)
supercli oapi-codegen config generate oapi-codegen.yaml api.yaml
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
