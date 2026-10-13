---
name: lftp
description: Use this skill when the user wants to transfer files over FTP/SFTP/HTTP, mirror directories, or script batch file transfers with lftp.
---

# lftp Plugin

lftp is a mature, scriptable file-transfer client: FTP/FTPS, SFTP, HTTP(S), FISH, BitTorrent. Key powers: `mirror` (recursive bidirectional sync), segmented parallel downloads (`pget`), background jobs, and resume on every protocol.

## Commands

### Sessions & scripting
- `lftp connect open <url>` — Interactive session (`sftp://user@host`, `ftp://host`...)
- `lftp exec run "<cmds>"` — Non-interactive (`-c`), e.g. `"open URL; mirror a b; bye"`
- `lftp script run <file>` — Run an lftp script (`-f`)
- `lftp _ _` — Passthrough to lftp CLI

## Usage Examples

- "Mirror that FTP directory to my local disk"
- "Upload this folder to the SFTP server, resuming where it stopped"
- "Download the big file in parallel segments"

## Installation

```bash
sudo apt-get install -y lftp
# or: sudo dnf install -y lftp / apk add lftp / brew install lftp
```

## Examples

```bash
# Mirror remote → local
lftp -c "open ftp://host; mirror --parallel=8 /remote/dir ./localdir; bye"

# Upload a tree (reverse mirror, delete extras)
lftp -c "open sftp://user@host; mirror -R --delete ./dist /var/www; bye"

# Segmented download of a single file
lftp -c "open http://host; pget -n 8 /big.iso; bye"

# Credentials inline
lftp -c "open -u user,password ftp://host; get file.txt; bye"

# Only newer files, keep going on errors
lftp -c "open sftp://host; mirror --only-newer --continue src dst; bye"
```

## Key Features

- `mirror` / `mirror -R` — bidirectional recursive sync with `--delete`, `--only-newer`, `--parallel`
- `pget -n N` — segmented parallel download; `put`, `mget`, `mput`, `get -c` resume
- Protocols: ftp, ftps, sftp, http(s), hftp, fish, torrent
- Queue + background jobs (`jobs`, `queue`), bookmarks, per-site settings
- Fully scriptable with `-e`, `-c`, `-f`; exits non-zero on failure for CI
