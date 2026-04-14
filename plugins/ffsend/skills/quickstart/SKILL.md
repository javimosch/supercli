---
name: ffsend
description: Use this skill when the user wants to share files from the command line, upload or download files securely with encryption, or manage file sharing links.
---

# ffsend Plugin

Easily and securely share files from the command line via Firefox Send.

## Commands

### Upload
- `ffsend upload run` — Upload files to Send service

### Download
- `ffsend download run` — Download files from Send service

### Inspect
- `ffsend info run` — Fetch info about shared file
- `ffsend delete run` — Delete shared file

## Usage Examples
- "Upload a file and share the link"
- "Download a file from a Send URL"
- "Check file info before downloading"
- "Delete a shared file"

## Installation

```bash
cargo install ffsend
# or
brew install ffsend
```

## Examples

```bash
# Simple upload
ffsend upload my-file.txt

# Upload with download limit
ffsend upload my-file.txt --downloads 1

# Upload with password
ffsend upload my-file.txt --password

# Download
ffsend download https://send.example.com/#share-url

# Check file info
ffsend info https://send.example.com/#share-url

# Delete shared file
ffsend delete https://send.example.com/#share-url
```

## Key Features
- Client-side encryption (AES-GCM)
- Password protection
- Download limits (1-20)
- Configurable expiry
- QR code generation
- History tracking