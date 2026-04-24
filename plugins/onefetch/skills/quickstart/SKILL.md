---
name: onefetch
description: Use this skill when the user wants to display Git repository statistics, language breakdown, commit history, or generate a summary of a codebase.
---

# onefetch Plugin

Command-line Git information tool that displays a repository summary with an ASCII art logo, language statistics, commit history, and contributor information. onefetch supports over 100 programming languages and outputs in multiple formats including JSON and YAML.

## Commands

### Repository Info
- `onefetch repo info` — Display Git repository summary with language stats and commit history
- `onefetch self version` — Print onefetch version
- `onefetch _ _` — Passthrough to onefetch CLI

## Usage Examples
- "Show summary of the current git repository"
- "Get repository stats in JSON format"
- "Show language breakdown for this repo"
- "Run onefetch on a specific directory"

## Installation

```bash
brew install onefetch
```

## Examples

```bash
# Display repository summary for current directory
onefetch repo info

# Output as JSON
onefetch repo info --json

# Output as YAML
onefetch repo info --yaml

# No ASCII art, just the stats
onefetch repo info --no-art

# Show only language breakdown
onefetch repo info --languages

# Run on a specific repository path
onefetch repo info -d /path/to/repo

# Disable colors
onefetch repo info --no-color
```

## Key Features
- ASCII art logo generated from the detected language
- Language statistics (lines of code, percentage)
- Commit history and contributor count
- Creation date and last change
- Churn and code of conduct detection
- Supports 100+ programming languages
- JSON and YAML output for scripting
- Customizable display via CLI flags
