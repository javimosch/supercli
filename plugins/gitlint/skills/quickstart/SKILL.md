---
name: gitlint
description: Use this skill when the user wants to lint git commit messages, enforce commit style rules, or set up a commit-msg hook with gitlint.
---

# gitlint Plugin

gitlint lints git commit messages — enforces title length, body-empty rules, hard tabs,
conventional-commit style, and fully custom regex rules via `.gitlint`. Works as a CLI,
a `commit-msg` git hook, or a CI gate over a branch's commits.

## Commands

### Linting
- `gitlint commit lint` — Lint the last commit
- `gitlint commit lint-range <range>` — Lint a revision range

### Setup
- `gitlint hooks install` — Install commit-msg hook in current repo
- `gitlint config init` — Generate `.gitlint` config
- `gitlint _ _` — Passthrough

## Usage Examples

- "Lint all commits on this PR branch"
- "Add a commit-msg hook enforcing conventional commits"
- "Check if my last commit message is well-formed"
- "Lint a message from stdin"

## Installation

```bash
pipx install gitlint
# or: pip install gitlint
```

## Examples

```bash
# Last commit
gitlint

# A range (PR-style gate)
gitlint --commits main..HEAD

# Message from stdin
echo "feat(x): add thing" | gitlint --msg-filename -

# Debug which rules are active
gitlint --debug
```

## Key Features

- Built-in rules: title length/empty, body existence, trailing whitespace, author checks
- User-defined rules via `[title-must-match]` / `[body-must-match]` regex sections
- `contrib` rules for conventional commits (`contrib-title-conventional-commits`)
- Exit code reflects violation count — easy CI gate
