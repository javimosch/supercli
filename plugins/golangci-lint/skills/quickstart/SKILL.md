# golangci-lint Quickstart

golangci-lint is a fast, parallel Go linter that combines 100+ linters.

## Commands
- `golangci-lint <resource> <action>` — Execute golangci-lint commands
- `golangci-lint self version` — Print golangci-lint version
- `golangci-lint lint run` — Lint Go code
- `golangci-lint lint json-output` — Lint with JSON output
- `golangci-lint _ _` — Passthrough to golangci-lint CLI

## Installation

```bash
brew install golangci-lint
```

## Basic Usage

### Lint current directory
```bash
golangci-lint run
```

### Lint specific package
```bash
golangci-lint run ./cmd/myapp
```

### JSON output
```bash
golangci-lint run --out-format=json
```

## Resources

- [GitHub](https://github.com/golangci/golangci-lint)
- [Docs](https://golangci-lint.run/)
