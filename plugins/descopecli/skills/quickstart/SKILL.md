---
name: descopecli
description: Use this skill when the user wants to Descope CLI.
---

# descopecli Plugin

A command line utility for performing common tasks on Descope projects. Supports JSON output for easy integration into scripts and CI/CD workflows.

## Commands
- `descopecli self version` — Print version
- `descopecli _ _ <args>` — Passthrough to descope

## Usage Examples
- "Descope CLI"

## Installation
```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys e8365d8513142909 && ...
```

## Key Features
- CLI-only, no interactive prompts
- No API keys or authentication required
- Pipeline-ready output format
```
