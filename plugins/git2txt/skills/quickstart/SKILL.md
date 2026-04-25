---
name: git2txt
description: Use this skill when the user wants to convert GitHub repositories to text files for LLMs.
---

# Git2txt Plugin

CLI tool to convert GitHub repositories to text files for LLMs.

## Commands

### Repository Conversion
- `git2txt repo convert` — Convert GitHub repository to text file

## Usage Examples
- "git2txt repo convert --repo username/repository"
- "git2txt repo convert --repo https://github.com/username/repo --output repo.txt"

## Installation

```bash
npm install -g git2txt
```

## Examples

```bash
# Convert repository using short format
git2txt username/repository

# Convert using full HTTPS URL
git2txt https://github.com/username/repository

# Convert using SSH format
git2txt git@github.com:username/repository

# Specify output file
git2txt username/repository --output repo.txt

# Set maximum file size in KB
git2txt username/repository --max-size 100
```

## Key Features
- Download any public GitHub repository
- Convert to single text file
- Automatic binary file exclusion
- Configurable file size threshold
- Cross-platform support
- Multiple URL formats supported
