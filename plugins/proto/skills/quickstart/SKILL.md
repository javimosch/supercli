# Proto Quick Start

Proto is a polyglot toolchain manager from moonrepo. It manages language runtimes, package managers, and dev tools.

## Commands
- `proto <resource> <action>` — Execute proto commands
- `proto self version` — Print proto version
- `proto tool install` — Install a tool (language runtime, package manager, or dev tool)
- `proto tool list` — List all installed tools
- `proto tool list-remote` — List available versions for a tool
- `proto tool uninstall` — Uninstall a tool
- `proto tool run` — Run a tool at its installed version
- `proto _ _` — Passthrough to proto CLI

## Prerequisites

- Install Proto: `curl -fsSL https://moonrepo.dev/install/proto.sh | sh`

## Basic Usage

### Install a tool
```bash
proto install node
proto install node --version 20
proto install rust
proto install go
```

### List installed tools
```bash
proto list
```

### List available versions
```bash
proto list-remote node
```

### Run a tool
```bash
proto run node -- --version
```

### Uninstall a tool
```bash
proto uninstall node
```

### Check version
```bash
proto --version
```

## Per-Directory Version Pinning

Proto supports `.proto` files for pinning tool versions per directory:
```
node = "20.11.0"
rust = "1.75.0"
```

## Passthrough

Any proto command can be run directly:
```bash
proto <any-subcommand> [args...]
```
