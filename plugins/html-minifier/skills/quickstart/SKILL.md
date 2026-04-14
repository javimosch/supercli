# html-minifier-next Quickstart

## Overview
`html-minifier-next` is a super-configurable web page minifier that handles HTML, CSS, JS, and SVG files.

## Usage

### Check version
```bash
html-minifier-next --version
```

### Minify a file
```bash
html-minifier-next input.html -o output.html
```

### Minify with options
```bash
html-minifier-next input.html --remove-comments --collapse-whitespace --minify-css --minify-js
```

## Common Options
- `--remove-comments` - Strip HTML comments
- `--collapse-whitespace` - Remove empty whitespace
- `--minify-css` - Minify CSS in style tags
- `--minify-js` - Minify JavaScript in script tags
- `-o, --output` - Output file path
- `-c, --config` - JSON configuration file

## Agent Usage
Use this plugin when the user wants to:
- Optimize web page file sizes
- Minify HTML/CSS/JS/SVG content
- Reduce bandwidth usage
- Speed up page load times
