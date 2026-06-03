---
name: git-filter-repo
description: Use this skill when the user wants to rewrite Git repository history — remove files, strip blobs, replace emails, or filter commits.
---

# git-filter-repo Plugin

A versatile tool for rewriting Git repository history — fast, Python-based replacement for git filter-branch.

## Commands

### Information
- `git-filter-repo self version` — Print git-filter-repo version

### Analysis
- `git-filter-repo analyze run` — Analyze repository history to prepare for filtering

### Path Operations
- `git-filter-repo path remove` — Remove files/folders from Git history
- `git-filter-repo path keep` — Keep only specified files/folders in Git history

### History Operations
- `git-filter-repo email replace` — Replace email addresses in Git history
- `git-filter-repo commit strip-blobs` — Strip blobs bigger than a given size from Git history
- `git-filter-repo message replace` — Replace text in commit messages across Git history

### Passthrough
- `git-filter-repo _ _` — Passthrough to git-filter-repo CLI

## Usage Examples
- "git-filter-repo --analyze"
- "git-filter-repo --path secrets.txt --invert-paths"
- "git-filter-repo --path src/ --path tests/"
- "git-filter-repo --strip-blobs-bigger-than 10M"
- "git-filter-repo --email-callback 'email.replace(b\"@old.com\", b\"@new.com\")'"
- "git-filter-repo --message-callback 'message.replace(b\"WIP\", b\"feat\")'"

## Installation

```bash
pip3 install --user git-filter-repo
# Or on macOS:
brew install git-filter-repo
```

## Key Features
- git
- history-rewriting
- filter-branch
- cleanup
- migration
