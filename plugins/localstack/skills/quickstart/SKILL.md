---
name: localstack
description: Local AWS cloud stack for offline development and testing
---
# localstack Plugin

LocalStack provides a fully functional local AWS cloud stack. Use it to develop and test your AWS applications offline without connecting to real AWS services.

## Commands
- `localstack <resource> <action>` — Execute localstack commands
- `localstack server start` — Start LocalStack container with local AWS services
- `localstack server stop` — Stop LocalStack running instance
- `localstack server status` — Show LocalStack service status
- `localstack config list` — Display active LocalStack configuration
- `localstack aws list-s3-buckets` — List S3 buckets via local AWS endpoint
- `localstack _ _` — Passthrough to localstack CLI

## Common Commands

- `localstack start` — start LocalStack
- `localstack stop` — stop LocalStack  
- `localstack status` — check service status
- `localstack aws <service> <action> [args]` — run AWS CLI commands locally
