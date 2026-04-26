---
name: grpcdebug
description: Use this skill when the user wants to cli for simplifying grpc application debugging.
---

# Grpcdebug Plugin

CLI for simplifying gRPC application debugging.

## Commands

### Operations
- `grpcdebug service health` — health service via grpcdebug
- `grpcdebug channel list` — list channel via grpcdebug
- `grpcdebug server stats` — stats server via grpcdebug
- `grpcdebug xds config` — config xds via grpcdebug

## Usage Examples
- "grpcdebug --help"
- "grpcdebug <args>"

## Installation

```bash
go install github.com/grpc-ecosystem/grpcdebug@latest
```

## Examples

```bash
grpcdebug --version
grpcdebug --help
```

## Key Features
- grpc\n- debugging\n- rpc
