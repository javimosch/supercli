# vector Quickstart

vector processes and routes logs and events with minimal overhead.

## Commands
- `vector <resource> <action>` — Execute vector commands
- `vector self version` — Print vector version
- `vector config validate` — Validate configuration file
- `vector run pipeline` — Run vector pipeline
- `vector _ _` — Passthrough to vector CLI

## Installation

```bash
brew install vector
```

## Basic Usage

### Validate config
```bash
vector validate vector.toml
```

### Run pipeline
```bash
vector --config vector.toml
```

## Resources

- [GitHub](https://github.com/vectordotdev/vector)
- [Docs](https://vector.dev/)
