---
name: urfave-cli
description: Use this skill when the user wants to build CLI applications in Go, create command-line tools, or work with the urfave/cli framework.
---

# urfave-cli Plugin

A command-line interface framework for Go. Build powerful CLI applications with flags, subcommands, and help text generation.

## Commands

### Project Management
- `urfave-cli project init` — Initialize new CLI project

### Utility
- `urfave-cli _ _` — Passthrough to urfave-cli CLI

## Usage Examples
- "Initialize CLI project"
- "Build Go CLI app"
- "Create command-line tool"
- "Use urfave/cli framework"

## Installation

```bash
brew install urfave-cli
```

Or via Go:
```bash
go install github.com/urfave/cli/v2/cmd/urfave-cli@latest
```

## Examples

```bash
# Initialize project
urfave-cli init myapp

# Initialize with module
urfave-cli init myapp --module github.com/user/myapp

# Any urfave-cli command with passthrough
urfave-cli _ _ init cli-tool
urfave-cli _ _ init mycli --module github.com/user/mycli
```

## Key Features
- **Framework** - CLI framework
- **Go** - Go language
- **Flags** - Flag support
- **Commands** - Subcommands
- **Help** - Auto help generation
- **Popular** - Popular framework
- **Easy** - Easy to use
- **Powerful** - Powerful features
- **CLI** - Command line apps
- **Development** - Go development

## Notes
- Popular Go CLI framework
- Easy to get started
- Great documentation
- Supports complex CLIs
- Auto-generated help
