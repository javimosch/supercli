---
name: templ
description: Use this skill when the user wants to compile or format templ templates, run the templ LSP, or work on a Go + htmx frontend project.
---

# templ Plugin

templ lets you write HTML components in .templ files that compile to type-safe Go code — catching markup/attribute errors at build time instead of in the browser.

## Commands

- `templ self version` — Print templ version
- `templ code generate` — Compile .templ files to Go (templ generate; -f file, -path dir, -watch, -lazy)
- `templ code fmt` — Format .templ files in place (templ fmt; -fail to exit non-zero on diffs, -v verbose)
- `templ lsp run` — Run the templ language server (templ lsp; -http localhost:7474 for a web debug view)
- `templ _ _` — Passthrough to templ CLI

## Usage Examples

- "Generate Go code from my .templ files"
- "Watch-mode regenerate templates while I edit"
- "Format all templates in this project"

## Installation

```bash
go install github.com/a-h/templ/cmd/templ@latest
# or: brew install templ
```

## Examples

```bash
templ generate              # compile .templ -> *_templ.go
templ generate -watch       # regenerate on change
templ generate -f page.templ  # single file
templ fmt .                 # format all .templ files
templ lsp -http localhost:7474  # LSP + debug UI
```

## Key Features

- Compile-time type checking for HTML markup and Go expressions
- First-class htmx/alpine pairing — attributes and expressions are typed
- LSP, formatter, and migrate/diagnose subcommands in one binary
