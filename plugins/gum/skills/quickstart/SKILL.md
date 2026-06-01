---
name: gum
description: Use this skill when the user wants to style shell output, format text, render tables, or create glamorous terminal scripts using gum.
---

# Gum Plugin

A tool for glamorous shell scripts — style, format, and interact like a charm. Part of the Charmbracelet ecosystem.

## Commands

### Styling
- `gum style apply` — Apply styling, coloring and formatting to text
- `gum format render` — Format text using markdown, template, code, or emoji formatters
- `gum table render` — Render a table from CSV/TSV or stdin data
- `gum join text` — Join text vertically or horizontally
- `gum write text` — Interactive multi-line text input component (TUI text area, not a file writer)
- `gum file pick` — Pick a file from the filesystem

## Usage Examples
- "gum style --foreground 212 --bold --border rounded 'Hello World'"
- "gum format --type markdown '# Heading\n\nSome text'"
- "gum table --columns 3 --border rounded < data.csv"

## Installation

```bash
brew install gum
```

## Examples

```bash
gum style --foreground 212 --bold --border rounded "Hello, World!"
gum format --type markdown "# Hello\nWorld"
gum table --columns 2 --border rounded < file.csv
gum join --horizontal "hello" "world"
```

## Key Features
- Text styling with colors, borders, padding, margin
- Markdown rendering with themes
- Table rendering from CSV/TSV/data
- File picker dialog
- Text input area
- Interactive prompts (confirm, choose, input, spinner)
