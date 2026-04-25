---
name: gox
description: Use this skill when the user wants to cross-compile Go binaries, build for multiple platforms, or create Go executables for different OS/arch.
---

# gox Plugin

A dead simple, no frills Go cross compile tool. Build Go binaries for multiple platforms at once.

## Commands

### Cross-Compilation
- `gox build cross` — Cross-compile Go binaries for multiple platforms

### Utility
- `gox _ _` — Passthrough to gox CLI

## Usage Examples
- "Cross-compile this Go project"
- "Build for multiple platforms"
- "Create Linux and Windows binaries"
- "Build Go for different architectures"

## Installation

```bash
go install github.com/mitchellh/gox@latest
```

## Examples

```bash
# Build for all platforms
gox build cross

# Build for specific OS
gox build cross -os="linux darwin windows"

# Build for specific architecture
gox build cross -arch="amd64 arm64"

# Build for specific OS and arch
gox build cross -osarch="linux/amd64 darwin/amd64 windows/amd64"

# Custom output template
gox build cross -output "{{.Dir}}_{{.OS}}_{{.Arch}}"

# Build current package
gox build cross ./...

# Build with verbose output
gox build cross -verbose

# Clean build directory first
gox build cross -clean

# Any gox command with passthrough
gox _ _ -osarch="linux/amd64 darwin/amd64"
gox _ _ -output "dist/{{.OS}}_{{.Arch}}/{{.Dir}}"
```

## Key Features
- **Simple** - Easy to use, no complex config
- **Fast** - Parallel compilation
- **All platforms** - Linux, macOS, Windows, BSD, more
- **Multiple arch** - amd64, arm, 386, etc.
- **Custom output** - Template-based naming
- **Clean builds** - Optional cleanup
- **Verbose mode** - See what's happening
- **Go native** - Uses Go toolchain

## Supported Platforms
- **OS**: linux, darwin, windows, freebsd, netbsd, openbsd, solaris
- **Arch**: amd64, 386, arm, arm64, ppc64, ppc64le, mips, mipsle, etc.

## Notes
- Requires Go installed
- Builds from current directory by default
- Output goes to current directory
- Use -output to customize
- Great for release automation
- Can be used in CI/CD pipelines
