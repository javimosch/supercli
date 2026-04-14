# Surf CLI Quickstart

Browser automation for AI agents using Chrome.

## Commands

- `surf --version` - Get CLI version
- `surf browse <url>` - Navigate to URL
- `surf screenshot` - Capture current page
- `surf evaluate <script>` - Run JavaScript in browser

## Examples

### Navigate and screenshot
```
surf browse https://example.com
surf screenshot
```

### Extract page content
```
surf evaluate "document.body.innerText"
```
