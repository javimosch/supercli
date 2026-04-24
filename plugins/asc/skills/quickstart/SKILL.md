---
name: asc
description: Use this skill when the user wants to automate iOS app deployment, manage TestFlight, handle builds and submissions, manage App Store Connect API, or work with iOS app store operations.
---

# asc Plugin

Fast, scriptable CLI for the App Store Connect API. Automate TestFlight, builds, submissions, signing, analytics, screenshots, subscriptions, and more. JSON-first, no interactive prompts.

## Commands

### Authentication
- `asc auth login` — Authenticate with App Store Connect API
- `asc auth status` — Check authentication status
- `asc auth doctor` — Validate authentication configuration

### App Management
- `asc apps list` — List all apps

### Utility
- `asc self version` — Print asc version
- `asc _ _` — Passthrough to asc CLI

## Usage Examples
- "List all apps in App Store Connect"
- "Authenticate with App Store Connect API"
- "Check authentication status"
- "List TestFlight builds"
- "Submit app for review"

## Installation

```bash
brew install asc
```

Or via install script (macOS/Linux):
```bash
curl -fsSL https://asccli.sh/install | bash
```

## Examples

```bash
# Authenticate with API keys
asc auth login \
  --name "MyApp" \
  --key-id "ABC123" \
  --issuer-id "DEF456" \
  --private-key /path/to/AuthKey.p8 \
  --network

# Authenticate for CI (bypass keychain)
asc auth login \
  --bypass-keychain \
  --name "MyCIKey" \
  --key-id "ABC123" \
  --issuer-id "DEF456" \
  --private-key /path/to/AuthKey.p8

# Validate authentication
asc auth status --validate
asc auth doctor

# List apps
asc apps list
asc apps list --output table
asc apps list --output json --pretty

# Set default output format
export ASC_DEFAULT_OUTPUT=markdown

# Any asc command with passthrough
asc _ _ testflight list
asc _ _ builds list --app-id "com.example.app"
```

## Key Features
- **JSON-first design** — Non-interactive, scriptable output by default
- **TTY-aware output** — Automatically chooses table for terminals, JSON for pipes/CI
- **No interactive prompts** — Designed for CI/CD and automation
- **Comprehensive coverage** — TestFlight, builds, submissions, signing, analytics, screenshots, subscriptions
- **Stability labels** — Visible lifecycle labels (experimental, DEPRECATED) for CI confidence
- **Config-backed auth** — Bypass keychain for CI environments
- **Fast performance** — Optimized for speed in automated workflows
- **147 releases** — Active development with frequent updates

## Common Workflows
- **TestFlight feedback and crashes** — Manage beta testing and crash reports
- **Builds and distribution** — Handle build uploads and distribution
- **Release management** — High-level App Store publish flow
- **Review status** — Check app review status and blockers
- **Metadata** — Manage app metadata and localization
- **Screenshots and media** — Upload and manage screenshots
- **Signing and bundle IDs** — Manage code signing and bundle identifiers
- **Workflow automation** — End-to-end CI/CD workflows
- **Xcode integration** — Verified local Xcode to TestFlight workflow

## Notes
- API keys must be generated at https://appstoreconnect.apple.com/access/integrations/api
- Use `--bypass-keychain` for CI environments where keychain access is unavailable
- Output format defaults: table for TTY, json for non-TTY (pipes/files/CI)
- Set `ASC_DEFAULT_OUTPUT` environment variable for global preference
- Stability labels indicate command maturity: no label = stable, [experimental] = evolving, DEPRECATED = migration path
- Commands with no stability label are suitable for production CI use
