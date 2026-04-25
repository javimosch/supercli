---
name: dbxcli
description: Use this skill when the user wants to manage Dropbox files, upload/download files, or access Dropbox from the command line.
---

# dbxcli Plugin

A command line client for Dropbox. Manage Dropbox files and folders directly from the terminal with upload, download, and sync capabilities.

## Commands

### File Management
- `dbxcli file list` — List Dropbox files
- `dbxcli file upload` — Upload file to Dropbox
- `dbxcli file download` — Download file from Dropbox

### Utility
- `dbxcli _ _` — Passthrough to dbxcli CLI

## Usage Examples
- "List Dropbox files"
- "Upload file to Dropbox"
- "Download from Dropbox"
- "Manage Dropbox from terminal"

## Installation

```bash
brew install dbxcli
```

Or via Go:
```bash
go install github.com/dropbox/dbxcli/cmd/dbxcli@latest
```

Requires Dropbox authentication.

## Examples

```bash
# List root directory
dbxcli ls

# List specific folder
dbxcli ls /Documents

# Long format
dbxcli ls --long

# Upload file
dbxcli upload myfile.txt /Documents/

# Download file
dbxcli get /Documents/file.txt ./local-file.txt

# Any dbxcli command with passthrough
dbxcli _ _ ls --recursive
dbxcli _ _ upload photo.jpg /Photos/
dbxcli _ _ get /file.txt ./file.txt
```

## Key Features
- **Upload** - File upload
- **Download** - File download
- **List** - Directory listing
- **Sync** - File sync
- **Dropbox** - Dropbox integration
- **Cloud** - Cloud storage
- **Auth** - OAuth authentication
- **Files** - File management
- **Folders** - Folder management
- **CLI** - Command line native

## Notes
- Official Dropbox CLI
- Requires OAuth setup
- Great for Dropbox automation
- Supports batch operations
