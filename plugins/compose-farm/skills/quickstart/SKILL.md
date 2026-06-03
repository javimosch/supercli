---
name: compose-farm
description: Use this skill when the user wants to manage Docker Compose deployments across multiple hosts using compose-farm.
---

# compose-farm Plugin

Docker compose across multiple hosts — deploy and manage containerized applications across a fleet of servers.

## Commands

- `compose farm run <args>` -- Run Docker compose across multiple hosts

## Usage Examples

Deploy to all hosts:
```
compose farm run up
```

Deploy to specific host:
```
compose farm run --host <hostname> up
```

Stop all services:
```
compose farm run down
```

View logs across hosts:
```
compose farm run logs
```

## Installation

```
pip install compose-farm
```

## Key Features

- Multi-host Docker Compose management
- Parallel deployment across servers
- Centralized logging and monitoring
- SSH-based remote execution
- Host grouping and filtering
