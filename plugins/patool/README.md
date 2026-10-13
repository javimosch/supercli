# patool Plugin for SuperCLI

[patool](https://github.com/wummel/patool) is a universal archive manager CLI. One
consistent interface — `extract`, `create`, `list`, `test` — across tar, zip, 7z, rar,
gzip/bzip2/xz/zstd, cpio, deb/rpm and dozens of other formats, dispatching to whatever
helper binaries are installed.

## Installation

```bash
# Install patool (pick one)
sudo apt-get install -y patool
# or: pipx install patool / brew install patool

# Optional format helpers
sudo apt-get install -y p7zip-full unrar zstd

# Install supercli plugin
supercli plugins install ./plugins/patool
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli patool self version` | Show patool version |
| `supercli patool archive extract <file>` | Extract any archive |
| `supercli patool archive create <out>` | Create an archive |
| `supercli patool archive list <file>` | List archive contents |
| `supercli patool archive test <file>` | Verify archive integrity |
| `supercli patool formats list` | Show supported formats/helpers |
| `supercli patool <any>` | Passthrough (diff, repack, search...) |

## Usage

```bash
# Extract — works the same for .zip, .tar.gz, .rar, .7z, .deb...
supercli patool archive extract bundle.tar.xz --outdir ./unpacked

# Create — format inferred from extension
supercli patool archive create backup.tar.gz ./src/

# Peek inside without extracting
supercli patool archive list release.zip

# Convert between formats
supercli patool _ _ _args="repack old.zip new.7z"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
