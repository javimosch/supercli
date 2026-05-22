# vx Quickstart

vx is a universal development tool manager that auto-installs runtimes on-demand. Use this skill when you need to:

- Run tools without manual runtime installation
- Manage multiple development toolchains (Node.js, Python, Go, Rust, Java, etc.)
- Set up project development environments
- Execute commands in CI/CD without environment setup
- Enable AI agents to use any tool without configuration

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/loonghao/vx/main/install.sh | bash
vx --version
```

Windows (PowerShell):
```powershell
powershell -c "irm https://raw.githubusercontent.com/loonghao/vx/main/install.ps1 | iex"
```

## Basic Usage

### Direct Execution

Just prefix any command with `vx` - tools are auto-installed on first use:

```bash
# Node.js tools
vx npx create-react-app my-app
vx node --version

# Python tools (via UV)
vx uvx ruff check .
vx python --version

# Go tools
vx go run main.go
vx go version

# Rust tools
vx cargo build --release
vx cargo --version

# Java tools
vx java -version
vx mvn clean install
```

### Runtime Version Specification

```bash
# Specific version
vx node@20 --version
vx python@3.12 --version
vx go@1.21 version

# Latest version
vx node@latest --version
vx python@latest --version
```

## Project Development Environment

### Initialize Project

```bash
# Create vx.toml configuration
vx init
```

### Manual Configuration

Create `vx.toml`:

```toml
[tools]
node = "20"
python = "3.12"
uv = "latest"
go = "1.21"

[scripts]
dev = "npm run dev"
test = "npm test"
lint = "uvx ruff check ."
```

### Project Commands

```bash
# Install all project tools
vx setup

# Enter development shell with all tools
vx dev

# Run project scripts
vx run dev
vx run test
vx run lint

# Manage project tools
vx add bun
vx remove go
vx sync
```

## Runtime Management

### Install Runtimes

```bash
# Install specific version
vx install node@20
vx install python@3.12
vx install go@1.21

# Install latest
vx install node@latest
```

### List and Search

```bash
# List all supported runtimes
vx list

# Search for runtimes
vx search node
vx search python
```

### Version Management

```bash
# Switch versions
vx switch node@20
vx switch python@3.12

# Show current version
vx which node
vx which python

# Show available versions
vx versions node
vx versions python
```

### Uninstall

```bash
vx uninstall node@20
vx uninstall python@3.12
```

## Global Package Management

### Install Packages

```bash
# Install global package
vx pkg install :ruff
vx pkg install :pre-commit
vx pkg install :black
```

### Package Management

```bash
# List installed packages
vx pkg list

# Show package info
vx pkg info :ruff

# Uninstall package
vx pkg uninstall :ruff
```

## Advanced Usage

### Execute Specific Executable

```bash
# Execute specific executable from runtime
vx node@20::npm install
vx python@3.12::pip list
```

### Execute Package

```bash
# Execute package directly
vx :ruff check .
vx :pre-commit run
```

### Inject Companion Runtimes

```bash
# Inject additional runtimes for this invocation
vx --with python@3.12 node script.js
```

### Development Shell Commands

```bash
# Launch shell with runtime environment
vx shell launch node@20 bash
vx shell launch python@3.12 zsh

# Run command in dev environment
vx dev -c "npm test"
```

## Project Lock File

```bash
# Generate lock file for reproducibility
vx lock

# Check version constraints
vx check
```

## Tips

- Use `vx` prefix for any tool - no manual installation needed
- Create `vx.toml` for team consistency and reproducible builds
- Use `vx dev` for integrated development environments
- Ideal for CI/CD - no runtime setup required
- Works with AI coding assistants (Claude Code, Cursor, Copilot)
- Supports shell integration and headless mode
- Zero configuration for basic usage
- Auto-detects and installs missing runtimes
