# Scarb Quick Start

Scarb is the Cairo package manager for Starknet smart contracts and Cairo programs.

## Prerequisites

- Install Scarb: `curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh`

## Basic Usage

### Initialize a new project
```bash
scarb init --name my-project
```

### Build the project
```bash
scarb build
```

### Run tests
```bash
scarb test
```

### Clean build artifacts
```bash
scarb clean
```

### Check version
```bash
scarb --version
```

## Passthrough

Any scarb command can be run directly:
```bash
scarb <any-subcommand> [args...]
```

## Tips

- Scarb manages Cairo dependencies via `Scarb.toml`
- Use `scarb fmt` to format code
- Use `scarb tree` to display dependency tree
