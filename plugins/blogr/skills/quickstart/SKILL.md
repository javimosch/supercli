---
name: blogr
description: Use this skill when the user wants to create, build, or manage a terminal-first blog or personal website using Markdown and static site generation.
---

# blogr Plugin

Terminal-first blog and personal website generator. Write, edit, and publish your blog without ever leaving your terminal. Supports Markdown with YAML frontmatter, multiple themes, RSS feeds, full-text search, and static site builds.

## Commands

### Project Management
- `blogr project init` — Initialize a new blog or personal website
- `blogr project info` — Show project details

### Content Management
- `blogr content new` — Create a new blog post
- `blogr content list` — List all blog posts

### Site Generation
- `blogr site build` — Build the static site

### Utility
- `blogr self version` — Print blogr version
- `blogr _ _` — Passthrough to blogr CLI

## Usage Examples
- "Create a new blog project"
- "Create a personal website"
- "Add a new blog post titled 'Getting Started'"
- "List all posts in the blog"
- "Build the static site for deployment"
- "Show project configuration"

## Installation

```bash
cargo install blogr-cli
```

## Examples

```bash
# Initialize a new blog
blogr project init my-blog

# Initialize a personal website
blogr project init --personal my-portfolio

# Create a new blog post
blogr content new "Hello World"

# List all posts
blogr content list

# Build the static site
blogr site build

# Show project info
blogr project info

# Switch theme
blogr _ _ theme set minimal-retro
```

## Key Features
- Two site types: Blog mode and Personal/Portfolio mode
- Markdown posts with YAML frontmatter
- 8 built-in themes for blogs and personal sites
- Full-text search with MiniSearch integration
- Syntax highlighting for code blocks
- MathJax support for LaTeX math expressions
- RSS/Atom feeds (blog mode)
- SEO-friendly output
- Draft and published post management
- Tag-based organization
- Automatic slug generation
- External post support (link to posts hosted elsewhere)

## Notes
- `blogr serve` starts a live-reload dev server (run directly, not via supercli)
- `blogr edit` opens the built-in terminal editor (run directly, not via supercli)
- `blogr config edit` opens the interactive configuration editor (run directly, not via supercli)
- `blogr deploy` requires a GITHUB_TOKEN environment variable
- All project, content, and build commands are headless and safe for supercli
