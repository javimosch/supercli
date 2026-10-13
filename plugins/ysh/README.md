# ysh Plugin for SuperCLI

[Oils for Unix](https://www.oils.pub/) is an upgraded Unix shell, shipped as a
single native binary with two frontends:

- **OSH** — runs your existing bash/POSIX scripts, with better error handling
- **YSH** — a modern shell language with real types, structured data
  (JSON pipelines), procs/funcs, and cleaner syntax

## Installation

```bash
# Build from the release tarball (native C++, ~1-2 min, no deps)
# get oils-for-unix-*.tar.gz from https://www.oils.pub/release/latest/
tar xzf oils-for-unix-*.tar.gz && cd oils-for-unix-*/
./configure && _build/oils.sh && sudo ./install

# or: mise use ysh

# Install supercli plugin
supercli plugins install ./plugins/ysh
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli ysh self version` | Show ysh version |
| `supercli ysh shell exec "<code>"` | Execute YSH code |
| `supercli ysh osh exec "<code>"` | Execute bash-compatible code via OSH |
| `supercli ysh script run <file.ysh>` | Run a YSH script |
| `supercli ysh <any>` | Passthrough to ysh CLI |

## Usage

```bash
supercli ysh shell exec 'var d = {"a": 1}; json write (d)'
supercli ysh osh exec 'echo "$HOME"; ls -la | head'
supercli ysh script run build.ysh
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
