---
name: transfer.sh
description: Use this skill when the user wants to upload and share files from the command line.
---

# Transfer.sh Plugin

Easy and fast file sharing from the command-line with encryption and expiration options.

## Commands

### File Sharing
- `transfer.sh file upload` — Upload file and get shareable link
- `transfer.sh file download` — Download file from transfer.sh

## Usage Examples
- "transfer.sh file upload --file document.pdf"
- "transfer.sh file upload --file photo.jpg --max_downloads 5 --max_days 7"
- "transfer.sh file download --url https://transfer.sh/xyz/file"

## Installation

```bash
curl https://transfer.sh/install.sh | sh
# or download from https://github.com/dutchcoders/transfer.sh/releases
```

## Examples

```bash
# Upload a file
transfer document.pdf

# Upload with custom filename
transfer document.pdf --output-name report.pdf

# Upload with download limit (max 5 downloads)
transfer document.pdf --max-downloads 5

# Upload with expiration (7 days)
transfer document.pdf --max-days 7

# Encrypt file before upload
transfer secret.txt --encrypt

# Upload multiple files as zip
transfer file1.txt file2.txt file3.txt

# Upload from stdin
cat file.txt | transfer file.txt

# Download file
curl https://transfer.sh/xyz/document.pdf -o document.pdf

# Download with custom output
curl https://transfer.sh/xyz/file -o myfile

# Upload and get delete URL
transfer file.txt --verbose
```

## Key Features
- Fast file upload and sharing
- Optional encryption
- Download limits
- Expiration dates
- Multiple file upload (as zip)
- Upload from stdin
- Delete URL for file removal
- No account required
- Encrypted in transit
