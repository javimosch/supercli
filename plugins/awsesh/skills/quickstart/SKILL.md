---
name: awsesh
description: Use this skill when the user wants to manage AWS sessions and credentials.
---

# AWSesh Plugin

AWS session & credential manager written in TypeScript.

## Commands

### Sessions
- `awsesh session list` — List AWS sessions
- `awsesh session create` — Create a new AWS session

### Credentials
- `awsesh credential set` — Set AWS credentials

## Usage Examples

```bash
awsesh session list
awsesh session create --profile myprofile
awsesh credential set --access-key-id AKIA... --secret-access-key ...
awsesh --help
```

## Installation

```bash
npm install -g awsesh
```

## Key Features
- Manage multiple AWS sessions
- Set and rotate credentials
- Session-based credential isolation
