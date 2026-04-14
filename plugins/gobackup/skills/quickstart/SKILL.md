# gobackup Plugin Quickstart

## Overview

GoBackup CLI for backing up databases and files to cloud storages with scheduling support.

## Commands

### Backup Operations
- `gobackup backup run` — Run a backup with current config
- `gobackup daemon start` — Start daemon with scheduling and Web UI
- `gobackup daemon run` — Run without daemon mode

### Passthrough
- `gobackup _ _` — Run any gobackup command directly

## Installation

```bash
curl -sSL https://gobackup.github.io/install | sh
gobackup --version
```

## Configuration

Create `~/.gobackup/gobackup.yml`:

```yaml
models:
  my_backup:
    databases:
      mysql_db:
        type: mysql
        host: localhost
        port: 3306
        database: my_database
        username: root
        password: password
    storages:
      s3:
        type: s3
        bucket: my_backup
        region: us-east-1
        path: backups
        access_key_id: $S3_ACCESS_KEY_ID
        secret_access_key: $S3_SECRET_ACCESS_KEY
    compress_with:
      type: tgz
```

## Supported Databases

- MySQL / MariaDB
- PostgreSQL
- Redis
- MongoDB
- SQLite
- Microsoft SQL Server
- InfluxDB
- etcd
- Firebird

## Supported Storages

- Local
- FTP / SFTP / SCP
- Amazon S3
- Google Cloud Storage
- Azure Blob Storage
- Backblaze B2
- Cloudflare R2
- DigitalOcean Spaces
- Aliyun OSS
- QCloud COS
- MinIO
- And more...

## Usage Examples

```bash
# Run a backup
supercli gobackup backup run

# Start daemon with Web UI (port 2703)
supercli gobackup daemon start

# Run without daemon
supercli gobackup daemon run

# Raw passthrough
supercli gobackup _ _ -- perform
```

## Web UI

Start daemon and visit http://127.0.0.1:2703 to manage backups via browser.

## Notes

- Config location: `~/.gobackup/gobackup.yml` or `/etc/gobackup/gobackup.yml`
- Supports cron schedules for automated backups
- Built-in notifiers: Email, Webhook, Discord, Slack, Telegram, DingTalk, Feishu, etc.