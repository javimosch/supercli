---
name: desktop-commander
description: Use this skill when the user needs terminal control, file system search, or diff-based file editing via MCP.
---

# Desktop Commander MCP — Terminal + Filesystem for AI Agents

MCP server (6k⭐) that gives agents terminal execution, file search, and diff editing capabilities.

## Quick Start

```bash
sc desktop-commander self mcp      # Register MCP server
```

## MCP Tools Available

### Terminal
- `execute_command` — Run shell commands, get output
- `list_processes` — List running processes
- `get_terminal_info` — Shell type, PATH, env vars

### File System
- `search_files` — Search files by name/pattern
- `read_file` — Read file contents
- `write_file` — Write file (creates dirs)
- `get_file_info` — File metadata

### Diff Editing
- `read_multiple_files` — Read several files at once
- `edit_file` — Apply diff edits to files
- `view_diff` — Preview changes before applying

## Requirements

- Node.js 18+
- First run downloads @wonderwhy-er/desktop-commander

## Notes

- Terminal commands run with user permissions
- File edits use diff-patch, safe for large files
- Read-only operations available without write risk
- Combine with playwright-mcp for full browser+terminal agent
