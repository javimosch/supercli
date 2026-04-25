---
name: hover
description: Use this skill when the user wants to build, run, or manage Flutter desktop applications from the command line.
---

# hover Plugin

A CLI tool to build and run Flutter desktop applications. Build, run, and manage Flutter desktop apps from the command line.

## Commands

### App Management
- `hover app run` — Run Flutter desktop app
- `hover app build` — Build Flutter desktop app

### Utility
- `hover _ _` — Passthrough to hover CLI

## Usage Examples
- "Run Flutter desktop app"
- "Build Flutter app"
- "Flutter desktop CLI"
- "Manage Flutter desktop"

## Installation

```bash
brew install hover
```

Or via Go:
```bash
go install github.com/go-flutter-desktop/hover/cmd/hover@latest
```

## Examples

```bash
# Run app
hover run

# Run with target
hover run --target linux

# Build app
hover build

# Build release
hover build --release

# Any hover command with passthrough
hover _ _ run
hover _ _ build --target macos
hover _ _ run --debug
```

## Key Features
- **Flutter** - Flutter integration
- **Desktop** - Desktop apps
- **Build** - App building
- **Run** - App running
- **Go** - Go-flutter
- **CLI** - Command line native
- **Cross-platform** - Multiple platforms
- **Debug** - Debug builds
- **Release** - Release builds
- **Development** - Flutter development

## Notes
- Works with Go-flutter
- Supports multiple platforms
- Great for Flutter desktop
- Requires Flutter SDK
