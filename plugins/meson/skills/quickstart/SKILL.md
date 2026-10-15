---
name: meson
description: Meson — fast and user-friendly build system with Ninja backend
---

# meson Plugin

Meson — fast and user-friendly build system with Ninja backend

## Installation

```bash
pip3 install meson
brew install meson
```

Requires Ninja (ninja-build) to compile. Install with: pip3 install ninja or brew install ninja.

## Commands

### `sc meson setup init <builddir> [srcdir] [--prefix <value>] [--buildtype <value>] [--default-library <value>] [-D <value>]`

Initialize a build directory

- `builddir` (string, required) — Build directory path
- `srcdir` (string, optional) — Source directory path
- `--prefix` (string, optional) — Installation prefix
- `--buildtype` (string, optional) — Build type: plain, debug, debugoptimized, release, minsize
- `--default-library` (string, optional) — Library type: shared, static, both
- `-D` (string, optional) — Set option value (-Dkey=value)

### `sc meson compile build [builddir] [-j <value>]`

Build the project

- `builddir` (string, optional) — Build directory (default: builddir in cwd)
- `-j` (string, optional) — Number of parallel jobs

### `sc meson test run [builddir] [--suite <value>] [--verbose] [-j <value>]`

Run project tests

- `builddir` (string, optional) — Build directory
- `--suite` (string, optional) — Run specific test suite
- `--verbose` (boolean, optional) — Verbose output
- `-j` (string, optional) — Number of parallel tests

### `sc meson install run [builddir] [--destdir <value>] [--dry-run]`

Install the built project

- `builddir` (string, optional) — Build directory
- `--destdir` (string, optional) — Destination directory
- `--dry-run` (boolean, optional) — Print what would be installed

### `sc meson configure set <builddir> [-D <value>]`

Configure project options

- `builddir` (string, required) — Build directory
- `-D` (string, optional) — Set option value (-Dkey=value)

### `sc meson introspect query <builddir> [--targets] [--dependencies] [--projectinfo]`

Introspect the build system

- `builddir` (string, required) — Build directory
- `--targets` (boolean, optional) — List all targets
- `--dependencies` (boolean, optional) — List dependencies
- `--projectinfo` (boolean, optional) — Show project info

## Passthrough

```bash
sc meson _ _ <args...>
```

## SuperCLI

```bash
sc meson _ _ --help
sc plugins learn meson
```
