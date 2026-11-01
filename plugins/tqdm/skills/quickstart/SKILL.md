---
name: tqdm
description: tqdm — fast, extensible progress bar for Python with CLI pipe support
---

# tqdm Plugin

tqdm — fast, extensible progress bar for Python with CLI pipe support

## Installation

```bash
pip install tqdm
Verify: tqdm --version
```

## Commands

### `sc tqdm pipe progress [--total <value>] [--desc <value>] [--unit <value>] [--ncols <value>] [--mininterval <value>] [--ascii] [--bytes] [--leave] [--smoothing <value>] [--delay <value>] [--colour <value>] [--bar-format <value>] [--postfix <value>]`

Pipe stdin through a progress bar with total count

- `--total` (integer, optional) — Expected iteration count for progress estimation
- `--desc` (string, optional) — Prefix text for the progress bar
- `--unit` (string, optional) — Unit name for iterations (default: it)
- `--ncols` (integer, optional) — Fixed width for the progress bar
- `--mininterval` (number, optional) — Minimum update interval in seconds (default: 0.1)
- `--ascii` (boolean, optional) — Use ASCII characters instead of Unicode
- `--bytes` (boolean, optional) — Count bytes, scale to binary units
- `--leave` (boolean, optional) — Leave progress bar after completion (default: true)
- `--smoothing` (number, optional) — Exponential moving average smoothing (0-1)
- `--delay` (number, optional) — Delay display by N seconds (default: 0)
- `--colour` (string, optional) — Bar colour (e.g. 'green', '#00ff00')
- `--bar-format` (string, optional) — Custom bar format string
- `--postfix` (string, optional) — Additional stats to display at the bar end

### `sc tqdm pipe bytes [--desc <value>] [--ncols <value>] [--leave] [--colour <value>]`

Pipe data counting bytes with binary unit scaling

- `--desc` (string, optional) — Prefix text for the progress bar
- `--ncols` (integer, optional) — Fixed width for the progress bar
- `--leave` (boolean, optional) — Leave progress bar after completion
- `--colour` (string, optional) — Bar colour

## Passthrough

```bash
sc tqdm _ _ <args...>
```

## SuperCLI

```bash
sc tqdm _ _ --help
sc plugins learn tqdm
```
