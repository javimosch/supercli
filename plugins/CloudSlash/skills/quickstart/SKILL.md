---
name: CloudSlash
description: Use this skill when the user wants to perform AWS security forensics and analysis locally using CloudSlash.
---

# CloudSlash Plugin

Local-first AWS forensic engine — analyze AWS resources and identify security issues without sending data to external services.

## Commands

- `cloudslash forensics run <args>` -- Run local-first AWS forensic engine

## Usage Examples

Scan current AWS account:
```
cloudslash forensics run
```

Scan specific service:
```
cloudslash forensics run --service s3
```

Scan with specific profile:
```
cloudslash forensics run --profile production
```

Export results:
```
cloudslash forensics run --output report.json
```

## Installation

```
go install github.com/CloudSlash/cloudslash@latest
```

## Key Features

- Local-first analysis (no data leaves your machine)
- Scans multiple AWS services
- Identifies security misconfigurations
- Generates detailed reports
- Supports custom rules
