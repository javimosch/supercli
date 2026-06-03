---
name: telert
description: Use this skill when the user wants to get notifications when long-running commands complete using telert.
---

# telert Plugin

Alert on command completion — get notified when terminal commands finish execution.

## Commands

- `telert alert run <args>` -- Alert on command completion

## Usage Examples

Run command with notification:
```
telert alert run "make build"
```

Run with custom message:
```
telert alert run --message "Build complete!" "make build"
```

Run with sound notification:
```
telert alert run --sound "make build"
```

Run with desktop notification:
```
telert alert run --desktop "make build"
```

## Installation

```
pip install telert
```

## Key Features

- Desktop notifications
- Sound alerts
- Custom notification messages
- Works with any terminal command
- Supports multiple notification methods
