---
name: dockerfmt
description: Use this skill when the user wants to format Dockerfiles, check Dockerfile formatting, or apply consistent style to Docker build files.
---

# dockerfmt Plugin

Modern Dockerfile formatter written in Go. Format Dockerfiles with configurable indentation, trailing newlines, and redirect spacing. Compatible with pre-commit hooks and CI pipelines.

## Commands

### Formatting
- `dockerfmt format file` — Format Dockerfile(s)

### Utility
- `dockerfmt self version` — Print dockerfmt version
- `dockerfmt _ _` — Passthrough to dockerfmt CLI

## Usage Examples
- "Format this Dockerfile"
- "Check if all Dockerfiles are properly formatted"
- "Format all Dockerfiles in the project"
- "Apply consistent indentation to Dockerfiles"

## Installation

```bash
go install github.com/reteps/dockerfmt@latest
```

Or use the Docker image:
```bash
docker run --rm -v $(pwd):/data reteps/dockerfmt Dockerfile
```

## Examples

```bash
# Format a Dockerfile and print to stdout
dockerfmt format file Dockerfile

# Format in place (overwrite the file)
dockerfmt format file Dockerfile -w

# Format multiple Dockerfiles in place
dockerfmt format file Dockerfile.dev Dockerfile.prod -w

# Check if a Dockerfile is already formatted (CI-friendly)
dockerfmt format file Dockerfile -c

# Read from stdin and format
cat Dockerfile | dockerfmt _ _

# Format with 2-space indentation
dockerfmt format file Dockerfile -w -i 2

# Add trailing newline
dockerfmt format file Dockerfile -w -n

# Add spaces after redirect operators
dockerfmt format file Dockerfile -w -s

# Combine options: indent 2, newline, space redirects
dockerfmt format file Dockerfile -w -i 2 -n -s
```

## Key Features
- **Fast formatting** — Written in Go for speed
- **In-place editing** — `-w` flag to overwrite files
- **CI-friendly checking** — `-c` flag exits non-zero if not formatted
- **Configurable indentation** — `-i` flag for custom tab size (default: 4)
- **Trailing newline** — `-n` flag to end files with a newline
- **Redirect spacing** — `-s` flag for spaces after redirect operators
- **Pre-commit compatible** — Works with pre-commit hooks
- **Docker image available** — Run without installing locally
- **EditorConfig support** — Respects EditorConfig settings

## Notes
- `dockerfmt` is a modern alternative to `dockfmt`
- Supports ignoring directives via comments in Dockerfiles
- Use `-c` in CI pipelines to enforce formatting without modifying files
- The formatter respects existing Dockerfile structure while applying consistent style
- Shell completions are available via `dockerfmt completion <shell>`
