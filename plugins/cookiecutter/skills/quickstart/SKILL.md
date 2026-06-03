---
name: cookiecutter
description: Use this skill when the user wants to scaffold a new project from a template, create projects from cookiecutter templates, or bootstrap project structure.
---

# Cookiecutter Plugin

Create projects from project templates. Supports GitHub, GitLab, local paths, and zip archives.

## Commands

### Project Generation
- `cookiecutter project scaffold` — Create a new project from a template

### Utility
- `cookiecutter self version` — Print cookiecutter version

### Passthrough
- `cookiecutter _ _` — Passthrough to cookiecutter CLI

## Usage Examples
- "Create a Python package from a template"
- "Scaffold a new project from gh:user/repo"
- "Bootstrap a project with no prompts"
- "Use a local template directory"

## Installation

```bash
brew install cookiecutter
```

Or via pip:
```bash
pip install cookiecutter
```

## Examples

```bash
# Scaffold from a GitHub template
sc cookiecutter project scaffold --template gh:audreyr/cookiecutter-pypackage

# Scaffold without prompts (use defaults)
sc cookiecutter project scaffold --template gh:audreyr/cookiecutter-pypackage --no-input

# Scaffold to a specific output directory
sc cookiecutter project scaffold --template ./local-template --output-dir ./projects

# Use a specific template directory within a repo
sc cookiecutter project scaffold --template gh:user/repo --directory my-template

# Overwrite existing project
sc cookiecutter project scaffold --template gh:user/repo --overwrite-if-exists

# Passthrough: any cookiecutter command
sc cookiecutter _ _ gh:audreyr/cookiecutter-pypackage --no-input
```

## Key Features
- **Template sources** — GitHub, GitLab, local paths, zip URLs
- **Jinja2 templates** — Full Jinja2 template engine support
- **No-input mode** — Use defaults without prompting
- **Config files** — Custom configuration via cookiecutterrc
- **Replay mode** — Replay previous template generation
- **Directory filter** — Use subdirectory within a repo
- **Output control** — Specify output directory
- **Overwrite protection** — Overwrite flag for existing dirs
