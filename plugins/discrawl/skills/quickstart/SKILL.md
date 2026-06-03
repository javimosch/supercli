---
name: discrawl
description: Use this skill when the user wants to interact with Discord from the command line using discrawl.
---

# discrawl Plugin

Discord CLI with sqlite backend — browse and interact with Discord channels, messages, and servers from the terminal.

## Commands

- `discrawl discord run <args>` -- Run Discord CLI with sqlite backend

## Usage Examples

Start interactive Discord session:
```
discrawl discord run
```

List servers:
```
discrawl discord run --list-servers
```

List channels in a server:
```
discrawl discord run --server <server_id> --list-channels
```

Read messages from a channel:
```
discrawl discord run --channel <channel_id> --messages
```

## Installation

```
go install github.com/ayn2op/discrawl@latest
```

## Key Features

- SQLite backend for local message storage
- Browse servers, channels, and messages
- Search through message history
- Offline access to cached messages
- Terminal-based interface
