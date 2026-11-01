# Readme-Gen Quickstart

CLI that generates beautiful README.md files

## Commands
- `readme-gen <resource> <action>` — Execute readme-gen commands

## Installation

```bash
npm install -g readme-md-generator
```

## Basic Usage

Generate a new README interactively:
```bash
readme-md-generator
```

Generate README with specific template:
```bash
readme-md-generator --template path/to/template.md
```

## Options

```bash
readme-md-generator --help           # Show help
readme-md-generator --yes            # Skip prompts, use defaults
readme-md-generator --path ./docs    # Output to specific path
```

## Features

- Interactive prompts for project details
- Multiple built-in templates
- Automatic badge generation
- Customizable sections
