---
name: s5cmd
description: Use this skill when the user wants to work with S3 storage, copy files to/from S3, or perform S3 operations efficiently.
---

# s5cmd Plugin

Parallel S3 and local filesystem execution tool. Fast S3 operations with parallel execution for high performance.

## Commands

### S3 Operations
- `s5cmd s3 copy` — Copy files to/from S3

### Utility
- `s5cmd _ _` — Passthrough to s5cmd CLI

## Usage Examples
- "Copy files to S3"
- "Download from S3"
- "Sync S3 bucket"
- "List S3 objects"

## Installation

```bash
brew install s5cmd
```

Or via Go:
```bash
go install github.com/peak/s5cmd/cmd/s5cmd@latest
```

## Examples

```bash
# Copy to S3
s5cmd s3 copy localfile.txt s3://bucket/path/

# Copy from S3
s5cmd s3 copy s3://bucket/path/file.txt .

# Set concurrency
s5cmd s3 copy localfile.txt s3://bucket/path/ --concurrency 10

# Dry run
s5cmd s3 copy localfile.txt s3://bucket/path/ --dry-run

# Any s5cmd command with passthrough
s5cmd _ _ cp s3://bucket/path/ .
s5cmd _ _ ls s3://bucket/path/
s5cmd _ _ sync s3://bucket/path/ localdir
```

## Key Features
- **Parallel** - Concurrent operations for speed
- **S3** - AWS S3 support
- **GCS** - Google Cloud Storage support
- **Fast** - High performance
- **Copy** - Copy files to/from S3
- **Sync** - Sync directories
- **List** - List S3 objects
- **Delete** - Delete S3 objects
- **Wildcards** - Support for wildcards
- **Configurable** - Adjust concurrency

## Notes
- AWS credentials required
- Supports both S3 and GCS
- Can use wildcards for patterns
- Great for large file transfers
