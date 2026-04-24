---
name: json2dir
description: Use this skill when the user wants to convert JSON documents into directory structures, create files/symlinks/scripts from JSON, or manage dotfiles and configuration archives.
---

# json2dir Plugin

Convert JSON documents into directory structures — files, directories, symlinks, and executable scripts. Useful for managing dotfiles and configuration archives.

## Commands

### Data Conversion
- `json2dir data convert` — Convert JSON to directory structure

### Utility
- `json2dir self version` — Print json2dir version
- `json2dir _ _` — Passthrough to json2dir CLI

## Usage Examples
- "Convert this JSON file into a directory structure"
- "Create dotfiles from this JSON configuration"
- "Unpack this JSON archive into files"
- "Generate a directory tree from JSON input"

## Installation

```bash
cargo install json2dir
```

## Conversion Scheme

- **Strings** → Regular files with the string as content
- **Objects** → Directories with keys as filenames
- **Arrays `["link", "target"]`** → Symbolic links
- **Arrays `["script", "#!/bin/sh\n..."]`** → Executable scripts

## Examples

```bash
# Convert a JSON file to directory structure
json2dir data convert example-tree.json

# Pipe JSON from another command
cat config.json | json2dir data convert

# Create dotfiles from a JSON configuration
json2dir data convert dotfiles.json
```

### Example JSON Input

```json
{
  "greeting": "Hello, world!",
  "dir": {
    "subfile": "Content.\n",
    "subdir": {}
  },
  "symlink": ["link", "target path"],
  "script": ["script", "#!/bin/sh\necho Howdy!"]
}
```

This creates:
- `greeting` — regular file with "Hello, world!"
- `dir/` — directory with `subfile` and `subdir`
- `symlink` → symbolic link to "target path"
- `script` — executable shell script

## Key Features
- **JSON to filesystem**: Convert any JSON document into files and directories
- **Symlink support**: Create symbolic links with `["link", "target"]` arrays
- **Executable scripts**: Create scripts with `["script", "#!/bin/sh\n..."]` arrays
- **Empty directories**: Create empty directories with `{}`
- **Dotfile management**: Ideal for managing dotfiles with Nix or other tools
- **Pipes-friendly**: Reads from STDIN when no file is provided
- **Configuration archives**: Store entire directory trees as single JSON files

## Notes
- The tool accepts any valid JSON document
- Objects are recursively traversed to create nested directory structures
- File contents are written exactly as provided in JSON strings
- Arrays with two elements are interpreted as symlinks or scripts based on the first element
- Works great in pipelines with tools that generate JSON (e.g., `jq`, `yq`)
