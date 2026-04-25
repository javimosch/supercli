# flow - Terminal Kanban

## Overview
flow is a keyboard-first Kanban board for terminal workflows. Manage tasks and projects in the terminal.

## Quick Start

### Run Kanban board
```bash
sc flow run board <board-file>
```

### Passthrough to flow CLI
```bash
sc flow _ <flow-args>
```

## Key Features

- **Keyboard-First**: Navigate entirely with keyboard
- **Kanban Board**: Classic Kanban workflow
- **Terminal Native**: No external GUI required
- **Productivity**: Focused on terminal workflows
- **Local Mode**: Use local board files
- **Jira Mode**: Integration with Jira

## Installation

```bash
cargo install flow
```

## Usage Examples

### Run board
```bash
flow board.kanban
```

### Local mode
```bash
flow --local board.kanban
```

### Jira mode
```bash
flow --jira board.kanban
```

### Status check
```bash
flow status
```

## Notes

- Run `flow --help` to see all available options
