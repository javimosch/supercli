# Gitmoji Quickstart

A gitmoji interactive cli tool for using emojis on commits

## Installation

```bash
npm install -g gitmoji-cli
```

## Basic Usage

Interactive commit with emoji selection:
```bash
gitmoji commit
```

List all available gitmojis:
```bash
gitmoji list
```

Search for a specific gitmoji:
```bash
gitmoji search "fix"
```

## Options

```bash
gitmoji --help           # Show help
gitmoji commit           # Interactive commit
gitmoji -c "message"     # Commit with message
gitmoji --init           # Initialize gitmoji config
```

## Features

- Interactive emoji picker for commits
- Conventional commit format support
- Customizable configuration
- Integration with git hooks
