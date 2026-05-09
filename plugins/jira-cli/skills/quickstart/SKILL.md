---
name: jira-cli
description: Use this skill when the user wants to create, search, edit, assign, or manage Jira issues, epics, sprints, and projects from the command line.
---

# Jira CLI Plugin

Feature-rich Jira command-line tool for managing issues, epics, sprints, and projects. Non-interactive mode with `--no-input` and JSON output with `--raw`.

## Prerequisites

Requires Jira configuration via `jira init`:
- **Cloud**: JIRA_API_TOKEN environment variable
- **Server**: Password or Personal Access Token

```bash
# First-time setup
jira init
```

## Commands

### Version
- `jira self version` — Print version
- `jira self me` — Get current user

### Issues
- `jira issue list [--jql "query"] [-s "status"] [-y priority]` — List issues (JSON)
- `jira issue view ISSUE-1` — View single issue (JSON)
- `jira issue create -t Task -s "Title" -y High -b "Description"` — Create issue
- `jira issue edit ISSUE-1 -s "New title"` — Edit issue
- `jira issue assign ISSUE-1 "User Name"` — Assign issue

### Epics & Sprints
- `jira epic list PROJ` — List epics in project
- `jira sprint list --board 1 --state active` — List active sprints

### Projects
- `jira project list` — List all projects

### Full Access
- `jira _ _` — Passthrough for any jira command (epic add, sprint start, release, board, etc.)

## Usage Examples
- "Show all high priority issues assigned to me"
- "Create a new Jira task with high priority"
- "List issues in the To Do status"
- "View details of PROJ-123"
- "Assign PROJ-456 to John"
- "List all epics in the PROJ project"
- "Search issues with JQL: summary ~ cli"

## Installation

```bash
brew install jira-cli
```

Then configure:
```bash
jira init
export JIRA_API_TOKEN="your-token"
```

## Key Features
- **Non-interactive mode**: `--no-input` for agent-friendly scripting
- **JSON output**: `--raw` flag returns structured data
- **CSV output**: `--csv` flag for spreadsheet-friendly data
- **JQL support**: Raw JQL queries via `--jql` / `-q`
- **Rich filtering**: Filter by status, priority, labels, assignee, project, created date
- **Full lifecycle**: Create, edit, assign, transition, watch, comment, attach
- **Epic & Sprint management**: Track epics and sprints across projects
