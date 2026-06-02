# easyredmine-cli Quickstart

## Overview

easyredmine-cli lets you interact with EasyRedmine (Simpliciti's Redmine instance) directly from supercli. Read issues, post comments, and edit descriptions.

## Commands

### `sc easyredmine issue show <id>`
Read an issue's full details including description and comments.

```bash
sc easyredmine issue show 61809
sc easyredmine issue show 61809 --json     # machine-readable envelope
```

### `sc easyredmine issue comment <id> --text "<text>"`
Add a comment to an issue.

```bash
sc easyredmine issue comment 61809 --text "Comment from CLI"
```

### `sc easyredmine issue edit <id> --description "<text>"`
Edit an issue's description.

```bash
sc easyredmine issue edit 61809 --description "<p>Updated description</p>"
```

## First-time setup

```bash
# Build the binary
cd ~/ai/easyredmine-cli
go build -ldflags="-s -w" -o easyredmine-cli main.go
cp easyredmine-cli ~/.local/bin/

# Install the plugin via supercli
sc plugins install easyredmine-cli

# Configure API token
easyredmine-cli config set
```

Token stored in `~/.config/easyredmine-cli/config.json`.
