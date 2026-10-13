# lftp Plugin for SuperCLI

[lftp](https://github.com/lavv17/lftp) is a sophisticated file-transfer client supporting
FTP, FTPS, SFTP, HTTP/HTTPS, HFTP, FISH and BitTorrent. It mirrors directory trees in both
directions, does segmented parallel downloads, resumes interrupted transfers, and is fully
scriptable — a Swiss-army knife for moving files over the network.

## Installation

```bash
# Install lftp binary (pick one)
sudo apt-get install -y lftp
# or: sudo dnf install -y lftp / brew install lftp

# Install supercli plugin
supercli plugins install ./plugins/lftp
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli lftp self version` | Show lftp version |
| `supercli lftp connect open <url>` | Interactive session to a server |
| `supercli lftp exec run <cmds>` | Run commands non-interactively (`-c`) |
| `supercli lftp script run <file>` | Run an lftp script (`-f`) |
| `supercli lftp <any>` | Passthrough to lftp CLI |

## Usage

```bash
# Mirror a remote dir locally (recursive, parallel, resumable)
supercli lftp exec run "open -u user,pass ftp://host; mirror --parallel=8 /remote/dir ./localdir; bye"

# Reverse mirror (upload a directory tree)
supercli lftp exec run "open sftp://user@host; mirror -R ./site /var/www/site; bye"

# Single file over SFTP
supercli lftp exec run "open sftp://user@host; get /remote/big.iso; bye"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
