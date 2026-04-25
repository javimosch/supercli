---
name: sentry-cli
description: Use this skill when the user wants to manage Sentry projects, create releases, upload source maps, or work with Sentry from the command line.
---

# sentry-cli Plugin

A command-line tool for Sentry. Manage Sentry projects, releases, and upload source maps and debug files from the command line.

## Commands

### Release Management
- `sentry-cli release create` — Create a release

### Source Maps
- `sentry-cli sourcemaps upload` — Upload source maps

### Utility
- `sentry-cli _ _` — Passthrough to sentry-cli CLI

## Usage Examples
- "Create Sentry release"
- "Upload source maps"
- "Manage Sentry from CLI"
- "Deploy to Sentry"

## Installation

```bash
brew install sentry-cli
```

Or via Go:
```bash
go install github.com/getsentry/sentry-cli/cmd/sentry-cli@latest
```

Requires Sentry authentication token.

## Examples

```bash
# Create release
sentry-cli releases new v1.0.0

# Create release for project
sentry-cli releases new v1.0.0 --project my-project

# Upload source maps
sentry-cli releases files v1.0.0 upload-sourcemaps ./dist

# Upload with release
sentry-cli releases files v1.0.0 upload-sourcemaps ./dist --release v1.0.0

# Finalize release
sentry-cli releases finalize v1.0.0

# Any sentry-cli command with passthrough
sentry-cli _ _ releases new v1.0.0
sentry-cli _ _ releases finalize v1.0.0
sentry-cli _ _ projects list
```

## Key Features
- **Releases** - Release management
- **Sourcemaps** - Source map upload
- **Projects** - Project management
- **Sentry** - Sentry integration
- **Auth** - Token authentication
- **Debug** - Debug files
- **CLI** - Command line native
- **CI/CD** - CI/CD integration
- **Deploy** - Deployment
- **Monitor** - Error monitoring

## Notes
- Official Sentry CLI
- Requires auth token
- Great for CI/CD
- Supports source maps
