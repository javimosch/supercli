---
name: evans
description: Use this skill when the user wants to interact with gRPC services, call gRPC methods, or test gRPC APIs from the command line.
---

# evans Plugin

Evans is an expressive, universal gRPC client. More expressive than curl for interacting with gRPC services. Supports reflection, streaming, and more.

## Commands

### gRPC Calls
- `evans grpc call` — Call a gRPC method

### Utility
- `evans _ _` — Passthrough to evans CLI

## Usage Examples
- "Call gRPC method"
- "Test gRPC API"
- "gRPC client"
- "Interact with gRPC service"

## Installation

```bash
brew install evans
```

Or via Go:
```bash
go install github.com/ktr0731/evans@latest
```

## Examples

```bash
# Call with reflection
evens grpc call localhost:50051 --reflection

# With specific port
evens grpc call localhost --port 8080 --reflection

# With proto file
evens grpc call localhost:50051 --proto ./service.proto

# Any evans command with passthrough
evens _ _ cli localhost:50051
evens _ _ repl localhost:50051
```

## Key Features
- **gRPC** - Native gRPC support
- **Reflection** - Server reflection
- **Streaming** - Bidirectional streaming
- **REPL** - Interactive REPL
- **CLI** - Command line mode
- **Proto** - Proto file support
- **Universal** - Works with any gRPC
- **Easy** - Simple syntax
- **Expressive** - More than curl
- **Microservices** - Perfect for testing

## Notes
- Great for gRPC testing
- Supports server reflection
- Interactive REPL available
- Perfect for microservices
