# bunx Plugin

## Overview
The `bunx` plugin wraps Bun's package runner CLI. `bunx` is a fast npm package runner that downloads and executes npm packages on demand, caching them globally for reuse. It is the Bun equivalent of `npx` but significantly faster.

## What is bunx?
`bunx` is the Bun runtime's package runner. It allows you to run CLI tools from npm packages without installing them globally. Packages are automatically downloaded into a global cache and executed on the fly.

## Quick Start

### 1. Install bunx
bunx is bundled with the Bun runtime:
```bash
curl -fsSL https://bun.sh/install | bash
# or with Homebrew
brew install oven-sh/bun/bun
```

### 2. Verify installation
```bash
bunx --version
```

## Common Use Cases

### Run a package without installing
```bash
# Run a one-off command
bunx cowsay "Hello from bunx"

# Run prettier
bunx prettier --write src/
```

### Use a specific version
```bash
bunx typescript@5.0.0 --version
```

### Force using Bun runtime
```bash
bunx --bun vite dev
```

### When binary name differs from package name
```bash
bunx -p @angular/cli ng new my-app
```

## Key Flags
- `--bun` - Force execution with Bun instead of Node.js
- `-p, --package <package>` - Specify package when binary name differs
- `--no-install` - Skip installation if package not already installed
- `--verbose` - Enable verbose output
- `--silent` - Suppress output during installation

## Useful Commands
- `sc bunx _ _ <package>` - Run any npm package via bunx
- `sc bunx _ _ --bun <package>` - Run package with Bun runtime

## Tips
- Uses global cache at `~/.bun/install/cache/` for faster subsequent runs
- Supports all npm package names and versions
- Automatically resolves binary names from package.json

## Requirements
- Bun runtime installed

## Resources
- Docs: https://bun.sh/docs/cli/bunx
- GitHub: https://github.com/oven-sh/bun
