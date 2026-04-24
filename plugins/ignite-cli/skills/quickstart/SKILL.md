---
name: ignite-cli
description: Use this skill when the user wants to scaffold a blockchain application, build Cosmos SDK chains, or manage blockchain development workflows.
---

# ignite-cli Plugin

CLI tool for creating and maintaining blockchain applications. Scaffold, build, and manage Cosmos SDK blockchains from the command line.

## Commands

### Chain Operations
- `ignite-cli chain scaffold` — Scaffold a new blockchain
- `ignite-cli chain build` — Build the blockchain

### Utility
- `ignite-cli _ _` — Passthrough to ignite CLI

## Usage Examples
- "Scaffold a blockchain"
- "Build blockchain application"
- "Create Cosmos SDK chain"
- "Generate blockchain module"

## Installation

```bash
brew install ignite
```

## Examples

```bash
# Scaffold a new blockchain
ignite-cli chain scaffold my-blockchain

# Scaffold with custom prefix
ignite-cli chain scaffold my-blockchain --address-prefix mychain

# Build the chain
ignite-cli chain build

# Build for release
ignite-cli chain build --release

# Any ignite command with passthrough
ignite-cli _ _ chain serve
ignite-cli _ _ generate proto-go
```

## Key Features
- **Scaffold** - Generate blockchain code
- **Cosmos SDK** - Cosmos SDK based
- **Modules** - Generate modules
- **Proto** - Protocol buffer support
- **Build** - Build chains
- **Serve** - Local development server
- **Frontend** - Generate frontends
- **Wasm** - CosmWasm support
- **Test** - Testing utilities
- **Release** - Release builds

## Notes
- Requires Go installed
- Works with Cosmos SDK
- Great for blockchain development
- Supports module generation
