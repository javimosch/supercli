# codemap Skill

Use the codemap plugin to give AI agents instant architectural context about a codebase without burning tokens.

## Quick Start

### 1. Install
```bash
codemap --version
```

### 2. Scan the Codebase

Build the architectural map of the project:
```bash
dcli codemap scan run
```

### 3. Get Architectural Context

Get a high-level overview of the project structure:
```bash
dcli codemap context run
```

### 4. Query the Architecture

Ask questions about the project architecture:
```bash
dcli codemap query run --question "What is the main entry point of this application?"
```

## Agent Notes

- codemap reduces token usage by providing structured architectural context instead of raw code dumps.
- Run `codemap scan` first to build the project map before querying.
- Useful for onboarding new agents or understanding unfamiliar codebases quickly.
- Author: @JordanCoin
