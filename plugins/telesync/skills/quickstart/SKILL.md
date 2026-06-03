---
name: telesync
description: Use this skill when the user wants to store or retrieve files on Telegram.
---

# TeleSync Plugin

Store files on Telegram, written in Python.

## Commands

### Files
- `telesync file upload` — Upload a file to Telegram
- `telesync file download` — Download a file from Telegram
- `telesync file list` — List stored files on Telegram

## Usage Examples

```bash
telesync file upload --path ./myfile.txt
telesync file download --id 12345 --output ./downloaded.txt
telesync file list
telesync --help
```

## Installation

```bash
pip install telesync
```

## Key Features
- Store files on Telegram as a free cloud backend
- Upload and download files
- List stored files
- Telegram Bot API integration
