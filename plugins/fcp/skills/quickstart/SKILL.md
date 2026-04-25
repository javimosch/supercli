# fcp - Fast Copy

## Overview
fcp is a significantly faster alternative to the classic Unix cp(1) command for copying large files and directories. It's optimized for speed on modern systems with parallel processing.

## Quick Start

### Copy file to destination
```bash
sc fcp copy file <source> <destination>
```

### Copy files to directory
```bash
sc fcp copy directory <sources> <destination>
```

### Passthrough to fcp CLI
```bash
sc fcp _ <fcp-args>
```

## Key Features

- **Faster than cp**: Significantly faster for large files and directories
- **Parallel Processing**: Utilizes multiple cores for faster copying
- **Same Interface**: Drop-in replacement for cp with similar usage
- **Cross-Platform**: Works on macOS, Linux, and other Unix-like systems
- **Progress Feedback**: Shows progress during large copies

## Installation

```bash
cargo install fcp
```

Or download pre-built binaries from releases.

## Usage Examples

### Copy a single file
```bash
fcp large_file.iso /backup/
```

### Copy multiple files to directory
```bash
fcp file1.txt file2.txt file3.txt /destination/
```

### Copy entire directory
```bash
fcp -r /source/directory /destination/
```

### Copy with overwrite
```bash
fcp source.txt destination.txt
```

## Notes

- fcp is designed to be faster than the traditional cp command
- Best performance gains are seen with large files and directories
- The interface is similar to cp for easy adoption
- Use `--help` to see all available options
