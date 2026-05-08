# golangci-lint Quickstart

golangci-lint is a fast, parallel Go linter that combines 100+ linters.

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
