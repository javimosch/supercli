# nb Quickstart

nb is a command line and local web note-taking, bookmarking, archiving, and knowledge base application. Use this skill when you need to:

- Create and manage notes from the terminal
- Bookmark web pages with local caching
- Build a personal knowledge base with wiki-style linking
- Organize notes with folders, tags, and pinning
- Encrypt sensitive notes and bookmarks
- Use Git for versioning and syncing
- Convert notes between formats with Pandoc

## Installation

```bash
npm install -g nb.sh
nb --version
```

Also available via Homebrew: `brew install xwmx/taps/nb`

## Core Note Operations

### Add a Note

```bash
# Quick note (opens editor)
nb add

# Add note with content
nb add "My note content"

# Add note with title
nb add --title "Meeting Notes" "Discussion points..."

# Add note with tags
nb add --tags work,important "Project update"

# Add note to specific folder
nb add --folder projects "New feature idea"
```

### List Notes

```bash
# List all notes
nb

# List notes in folder
nb projects:

# Search notes
nb search "keyword"

# Filter by tags
nb search #tag
```

### Show a Note

```bash
# Show by ID
nb show 1

# Show by title/identifier
nb show "meeting notes"

# Show with syntax highlighting
nb show 1 --color
```

### Edit a Note

```bash
# Edit by ID
nb edit 1

# Edit by title
nb edit "meeting notes"
```

### Delete a Note

```bash
# Delete by ID
nb delete 1

# Delete by title
nb delete "meeting notes"
```

## Bookmarking

### Add a Bookmark

```bash
# Add bookmark (fetches and caches page content)
nb bookmark:add https://example.com

# Add with title
nb bookmark:add https://example.com --title "Example Site"

# Add with tags
nb bookmark:add https://example.com --tags dev,reference

# Add with comment
nb bookmark:add https://example.com --comment "Useful resource"
```

### List Bookmarks

```bash
# List all bookmarks
nb bookmarks:

# Search bookmarks
nb search https://
```

### Browse Bookmarks

```bash
# Open local web browser
nb browse

# Open specific bookmark
nb browse 1
```

## Organization

### Folders

```bash
# List folders
nb folders:

# Create folder
nb folder:create projects

# Add note to folder
nb add --folder projects "Note content"
```

### Tags

```bash
# Add tags to note
nb 1 tag work,important

# Remove tags
nb 1 untag work

# List by tag
nb search #work
```

### Pinning

```bash
# Pin a note
nb pin 1

# Unpin
nb unpin 1

# List pinned
nb search pinned:true
```

## Advanced Features

### Encryption

```bash
# Create encrypted note
nb add --encrypt "Secret information"

# Create encrypted bookmark
nb bookmark:add https://example.com --encrypt

# Decrypt when viewing
nb show 1 --decrypt
```

### Git Integration

```bash
# Git is automatically used for versioning
# View history
nb git:log

# Sync with remote
nb git:pull
nb git:push
```

### Import/Export

```bash
# Import file
nb import document.md

# Export note
nb export 1 --format markdown

# Export to PDF (requires Pandoc)
nb export 1 --format pdf
```

### Wiki-Style Linking

```bash
# Link to other notes
nb add "See [[meeting notes]] for details"

# Link creates automatic cross-references
```

## Search

```bash
# Full-text search
nb search "keyword"

# Search with regex
nb search "regex.*pattern"

# Search in specific folder
nb projects: search "keyword"

# Search by tag
nb search #tag

# Combine filters
nb search #work and "urgent"
```

## Notebooks

```bash
# Create new notebook
nb notebooks:create work

# List notebooks
nb notebooks:

# Switch notebook
nb notebooks:use work

# Set current notebook as default
nb notebooks:pin work
```

## Todo Lists

```bash
# Add todo item
nb add --todo "Fix bug in production"

# Mark as complete
nb 1 todo:complete

# List todos
nb search todo:true
```

## Tips

- Use `nb browse` for local web interface with distraction-free reading
- Enable optional dependencies (bat, rg, pandoc) for enhanced features
- Use `nb help` for comprehensive command reference
- Notes are stored in plain text for easy version control
- Supports Vim, Emacs, VS Code, and any text editor
- Works on Linux, macOS, and Windows (WSL/MSYS/Cygwin)
- Single portable shell script with progressive enhancement
