---
name: textlint
description: Use this skill when the user wants to check writing quality — grammar, spelling, style, and readability in Markdown, plain text, HTML, or reStructuredText files.
---

# textlint Plugin

textlint lints natural language text for quality issues.

## Commands
- `textlint <resource> <action>` — Execute textlint commands
- `textlint self version` — Print textlint version
- `textlint _ _` — Passthrough to textlint CLI

## Usage Examples

- "lint a markdown file for writing quality"
- "check text for readability issues"
- "lint all documents in docs/ directory"

## Installation

```bash
npm install -g textlint
```

## Key Features
- Multi-language natural language linting
- Pluggable rule presets (spelling, grammar, style)
- Markdown, plain text, HTML, reStructuredText support
- Readability scoring
- JSON output for CI
