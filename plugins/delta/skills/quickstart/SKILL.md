---
name: delta
description: Use this skill when the user wants to view syntax-highlighted git diffs, improve diff readability, or use a pager for diff output with beautiful formatting.
---

# delta Plugin

A syntax-highlighting pager for git and diff output. Make diffs readable with side-by-side comparison, line numbers, and beautiful highlighting.

## Commands

### Diff Display
- `delta diff show` — Show diff with syntax highlighting

### Utility
- `delta _ _` — Passthrough to delta CLI

## Usage Examples
- "Show highlighted diff"
- "View git diff with colors"
- "Side-by-side diff"
- "Pretty diff output"

## Installation

```bash
brew install git-delta
```

Or via Cargo:
```bash
cargo install git-delta
```

## Examples

```bash
# Show highlighted diff
delta diff show < my-changes.diff

# Side-by-side diff
git diff | delta diff show --side-by-side

# With dark theme
cat diff.txt | delta diff show --dark

# With light theme
cat diff.txt | delta diff show --light

# Any delta command with passthrough
git diff | delta _ _ --side-by-side
cat patch.diff | delta _ _ --file path/to/file
```

## Key Features
- **Syntax** - Syntax highlighting
- **Side-by-side** - Side-by-side mode
- **Git** - Git integration
- **Themes** - Multiple themes
- **Line numbers** - Line numbering
- **Hunks** - Hunk headers
- **Decorations** - File decorations
- **Hyperlinks** - Hyperlink support
- **Blame** - Blame integration
- **Paging** - Smart paging

## Notes
- Configure as git core.pager
- Great for git diff readability
- Supports many languages
- Pipe-friendly for scripting
