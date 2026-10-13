# Pyrefly Plugin for SuperCLI

[Pyrefly](https://github.com/facebook/pyrefly) is a fast Python type checker and language
server written in Rust by Meta. It checks over 1.85 million lines per second (~15x faster
than mypy/pyright on large codebases) and is the default type checker for Instagram's
Python monorepo.

## Installation

```bash
# Install pyrefly binary (pick one)
pip install pyrefly
# or: uv tool install pyrefly
# or: cargo install pyrefly
# or: brew install pyrefly

# Install supercli plugin
supercli plugins install ./plugins/pyrefly
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli pyrefly self version` | Show pyrefly version |
| `supercli pyrefly check run` | Type check the project |
| `supercli pyrefly config init` | Create config / migrate from mypy or pyright |
| `supercli pyrefly suppress run` | Silence existing errors with suppression comments |
| `supercli pyrefly infer run` | Insert inferred type annotations into source |
| `supercli pyrefly config dump` | Show the merged configuration |
| `supercli pyrefly <any>` | Passthrough to pyrefly CLI |

## Usage

```bash
# Type check, JSON output for pipelines
supercli pyrefly check run
supercli pyrefly check run --output-format json

# Adopt gradually
supercli pyrefly config init
supercli pyrefly suppress run    # baseline existing errors
supercli pyrefly infer run       # add inferred annotations
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
