# Resume Quickstart

CLI tool to easily setup a new resume

## Installation

```bash
npm install -g resume-cli
```

## Basic Usage

Initialize a new resume:
```bash
resume init
```

Validate your resume.json:
```bash
resume validate
```

Export to different formats:
```bash
resume export resume.html   # HTML format
resume export resume.pdf    # PDF format
```

## Options

```bash
resume --help             # Show help
resume init               # Create resume.json
resume serve              # Preview locally
resume export --theme modern  # Use specific theme
```

## Features

- JSON-based resume format
- Multiple export formats (HTML, PDF, Markdown)
- Theme support
- Validation against schema
