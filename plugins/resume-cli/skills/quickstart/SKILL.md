# Resume CLI Quickstart

Create professional resumes using the JSON Resume standard.

## Installation

```bash
npm install -g resume-cli
```

## Quick Start

```bash
# Create a new resume
resume init

# Edit the generated resume.json
# Then validate it
resume validate

# Serve locally to preview
resume serve

# Export to PDF
resume export resume.pdf

# Export to HTML
resume export resume.html
```

## Themes

Install a theme before exporting:

```bash
npm install -g jsonresume-theme-elegant
resume export resume.pdf --theme elegant
```

Popular themes:
- `jsonresume-theme-elegant`
- `jsonresume-theme-flat`
- `jsonresume-theme-modern`
- `jsonresume-theme-class`

## Resume.json Structure

```json
{
  "basics": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 555-5555"
  },
  "work": [...],
  "education": [...],
  "skills": [...]
}
```

## Publishing

```bash
# Publish to jsonresume.org
resume publish
```
