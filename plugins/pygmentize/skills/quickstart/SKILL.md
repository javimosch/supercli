---
name: pygmentize
description: Syntax highlighter for source code, powered by Pygments
---
# pygmentize Plugin
Highlight source code with syntax coloring in the terminal.

## Commands
- `pygmentize <resource> <action>` — Execute pygmentize commands
- `pygmentize self version` — Print pygmentize version
- `pygmentize self list-lexers` — List available lexers (languages)
- `pygmentize self list-styles` — List available styles
- `pygmentize _ _` — Passthrough to pygmentize CLI

## Usage
- `pygmentize self version` — Print version
- `pygmentize self list-lexers` — List available lexers
- `pygmentize self list-styles` — List available styles
- `pygmentize _ _ -l python file.py` — Highlight a Python file
- `pygmentize _ _ -g < file` — Guess lexer from content and highlight
