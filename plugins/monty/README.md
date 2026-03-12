# Monty Plugin for SuperCLI

Hybrid plugin for the [Monty](https://github.com/pydantic/monty) sandboxed Python interpreter.

## Overview

Monty is a minimal, secure Python interpreter written in Rust, designed for AI agents to run untrusted code safely. This plugin provides a Node.js wrapper for the `@pydantic/monty` package and indexes the upstream agent documentation into the SuperCLI skills catalog.

## Features

- **Sandboxed Execution**: Runs Python code without access to the host filesystem, network, or environment.
- **Dependency Management**: Controlled setup of the `@pydantic/monty` binary.
- **Skills Indexing**: Teaches agents about Monty's capabilities by indexing remote `README.md` and `CLAUDE.md`.
- **Hybrid Support**: Combines local CLI wrappers with remote documentation.

## Installation

1. Install the plugin:
   ```bash
   supercli plugins install ./plugins/monty
   ```
2. Setup the Monty dependency:
   ```bash
   supercli monty cli setup
   ```

## Usage

### Run Python Code

```bash
supercli monty python run "1 + 2"
```

### Run with Inputs

```bash
supercli monty python run "x + y" --inputs '{"x": 10, "y": 20}'
```

### Version and Status

```bash
supercli monty cli version
```

## Security

Monty executes code in a strict sandbox. The only way to interact with the host is through explicit external function calls (not yet exposed via this generic CLI wrapper).
