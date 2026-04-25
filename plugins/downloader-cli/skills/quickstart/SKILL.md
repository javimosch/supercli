# downloader-cli - Simple Downloader

## Overview
downloader-cli is a simple downloader written in Python with an awesome customizable progressbar. Supports batch downloads, resume, and quiet mode.

## Quick Start

### Download file
```bash
sc downloader download file <source-url> <target-path>
```

### Download with quiet mode
```bash
dw -q <source-url> <target-path>
```

### Batch download
```bash
dw -b <file-with-urls>
```

### Passthrough to downloader CLI
```bash
sc downloader _ <dw-args>
```

## Key Features

- **Progressbar**: Awesome customizable progressbar with icons
- **Batch Mode**: Download files in batch from a list
- **Resume**: Resume failed or cancelled downloads
- **Quiet Mode**: Suppress filesize and progress info
- **Force Overwrite**: Overwrite if file already exists
- **Customizable**: Custom colors and icons for progressbar

## Installation

```bash
pip install downloader-cli
```

Also available via:
- Arch Linux (AUR)
- Gentoo
- Conda-Forge

## Usage Examples

### Basic download
```bash
dw https://example.com/file.zip file.zip
```

### Resume download
```bash
dw -c https://example.com/file.zip file.zip
```

### Quiet download
```bash
dw -q https://example.com/file.zip file.zip
```

### Batch download
```bash
dw -b urls.txt
```

### Force overwrite
```bash
dw -f https://example.com/file.zip file.zip
```

## Notes

- Use `dw --help` to see all available options
- Supports custom colors for progressbar elements
- Can print filepath after download with -e flag
