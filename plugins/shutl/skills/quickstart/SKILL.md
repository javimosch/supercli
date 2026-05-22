---
name: shutl
description: Use this skill when the user wants to organize, manage, and execute shell scripts as commands with metadata-driven arguments and flags.
---

# Shutl Plugin

Command-line tool for organizing, managing, and executing shell scripts as commands. Automatically creates CLI commands from shell scripts with metadata-driven arguments and flags.

## Commands

### Script Management
- `shutl script create <location> <name>` — Create a new script with optional editor and type
- `shutl script edit <command>` — Edit an existing script

### Running User Scripts
- `shutl _ _ -- <command>` — Run any user-defined script with arguments and flags

## Usage Examples

```bash
# Create a new script
shutl script create tools deploy --type bash
shutl script create utils backup --editor vim

# Edit existing script
shutl script edit tools deploy

# Run user-defined scripts (after creation)
shutl tools deploy --input file.txt --host example.com
shutl utils backup --dry-run
```

## Installation

```bash
brew tap k15r/shutl
brew install shutl
```

Or from source:
```bash
git clone https://github.com/k15r/shutl.git
cd shutl
cargo build --release
```

## Script Metadata

Create shell scripts in `~/.shutl` directory with metadata comments:

```bash
#!/bin/bash
#@description: Example command with various metadata
#@arg:input - Input file path
#@arg:output - Output file path [default:output.txt]
#@flag:host - Host name [default:localhost]
#@flag:dry-run - Perform a dry run [bool,default:false]
#@arg:...files - Additional files to process

# Your script logic here
if [ "$SHUTL_DRY_RUN" = "true" ]; then
    echo "Dry run mode enabled"
fi
echo "Hostname: ${SHUTL_HOST}"
echo "Processing input file: $SHUTL_INPUT"
echo "Output will be saved to: $SHUTL_OUTPUT"
```

## Metadata Syntax

| Metadata | Syntax |
|----------|--------|
| Description | `#@description: Your command description` |
| Required argument | `#@arg:name - Argument description` |
| Optional argument with default | `#@arg:name - Argument with default [default:value]` |
| Argument with options | `#@arg:name - Argument with allowed values [options:val1\|val2]` |
| Catch-all argument | `#@arg:... - Additional arguments description` |
| Named catch-all | `#@arg:...name - Named catch-all arguments` |
| Required catch-all | `#@arg:...files - Required named catch-all [required]` |
| Flag with default | `#@flag:name - Flag with default value [default:value]` |
| Boolean flag | `#@flag:name - Boolean flag [bool]` |
| Flag with options | `#@flag:name - Flag with allowed values [options:val1\|val2]` |
| Required flag | `#@flag:name - Required flag [required]` |
| Flag with file completion | `#@flag:name - Flag with file completion [file]` |
| Flag with directory completion | `#@flag:name - Flag with directory completion [dir]` |
| Flag with path completion | `#@flag:name - Flag with any path completion [path]` |

## Command Completion

Enable command completion by adding to shell configuration:

**bash:**
```bash
. <(COMPLETE=bash shutl)
```

**zsh:**
```bash
. <(COMPLETE=zsh shutl)
```

## Key Features

- **Dynamic Command Generation**: Automatically creates CLI commands from shell scripts
- **Metadata Support**: Special comments define command metadata (description, args, flags)
- **Flexible Argument Handling**: Required and optional arguments with defaults
- **Boolean Flags**: Automatically generates flags with negated versions (--no-flag)
- **Catch-all Arguments**: Supports additional arguments beyond defined parameters
- **Directory-based Organization**: Organize commands in directories for better structure
- **Command Completion**: Shell completion for commands, arguments, and flags
- **Environment Variables**: Override default scripts directory with SHUTL_DIR

## Directory Descriptions

Add a `.shutl` file in any directory to provide a description in help output:

```bash
mkdir -p ~/.shutl/deploy
echo "Deployment scripts for various environments" > ~/.shutl/deploy/.shutl
```

## Environment Variables

- **SHUTL_DIR**: Override the default scripts directory (`~/.shutl`)

## Project Structure

```
~/.shutl/
├── command1.sh
└── subdir/
    ├── .shutl          # Optional: directory description
    └── command2.sh
```

## Common Workflows

### Creating a new script
```bash
shutl script create utils backup --type bash
# Edit the generated script with metadata
shutl script edit utils backup
```

### Organizing scripts by category
```bash
shutl script create deploy production
shutl script create deploy staging
shutl script create database migrate
```

### Running scripts with flags
```bash
# Boolean flags
shutl deploy production --dry-run
shutl deploy production --no-dry-run

# With arguments
shutl database migrate --env production --verbose
```