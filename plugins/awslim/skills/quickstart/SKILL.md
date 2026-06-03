---
name: awslim
description: Use this skill when the user wants a simplified, developer-friendly interface for AWS services using awslim.
---

# awslim Plugin

Simplified AWS CLI alternative — interact with AWS services using a cleaner, more intuitive command structure.

## Commands

- `awslim aws run <args>` -- Run simplified AWS CLI alternative

## Usage Examples

List S3 buckets:
```
awslim aws run s3 ls
```

Upload file to S3:
```
awslim aws run s3 cp file.txt s3://bucket/
```

List EC2 instances:
```
awslim aws run ec2 instances
```

Get instance details:
```
awslim aws run ec2 describe <instance_id>
```

## Installation

```
go install github.com/awslim/awslim@latest
```

## Key Features

- Simplified command structure
- Auto-completion support
- Colorized output
- Human-readable formatting
- Faster than standard AWS CLI
