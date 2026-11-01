---
name: release-it
description: Automate version bumps, changelog generation, git tags, and publishing to npm/GitHub/GitLab — all from one CLI command.
---

# release-it Plugin

Automate version bumps, changelog generation, git tags, and publishing to npm/GitHub/GitLab — all from one CLI command.

## Installation

```bash
npm install -g release-it
release-it --version
```

Requires Node.js 18+. Also install @release-it/XXX plugins for extended functionality (e.g., @release-it/conventional-changelog for conventional commits).

## Commands

### `sc release-it release create [--dry-run] [--ci] [--config <value>] [--no-git] [--no-npm] [--no-github] [--no-gitlab] [--increment <value>] [--preReleaseId <value>] [--npm.tag <value>] [--github.release]`

Create a new release (bump version, tag, push, publish)

- `--dry-run` (boolean, optional) — Show what would happen without making changes
- `--ci` (boolean, optional) — Run in CI mode (non-interactive)
- `--config` (string, optional) — Path to config file
- `--no-git` (boolean, optional) — Skip git steps
- `--no-npm` (boolean, optional) — Skip npm publish
- `--no-github` (boolean, optional) — Skip GitHub release
- `--no-gitlab` (boolean, optional) — Skip GitLab release
- `--increment` (string, optional) — Version increment (major, minor, patch, premajor, preminor, prepatch, prerelease)
- `--preReleaseId` (string, optional) — Pre-release identifier (e.g., beta, alpha, rc)
- `--npm.tag` (string, optional) — npm dist-tag (e.g., next, latest)
- `--github.release` (boolean, optional) — Create GitHub release

## Passthrough

```bash
sc release-it _ _ <args...>
```

## SuperCLI

```bash
sc release-it _ _ --help
sc plugins learn release-it
```
