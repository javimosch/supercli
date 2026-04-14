---
name: gobackup
description: Use this skill when the user wants to backup databases, archive files, or manage scheduled backups to cloud storage destinations like S3, GCS, Azure, or B2.
---

# gobackup Plugin

Backup databases and files to cloud storages with scheduling.

## Commands

### Backup Operations
- `gobackup backup run` — Run a backup with current config
- `gobackup daemon start` — Start daemon with scheduling and Web UI
- `gobackup daemon run` — Run without daemon mode

## Usage Examples
- "Run a backup now"
- "Start the backup daemon"
- "Run backup without daemon mode"

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

## Configuration

Create `~/.gobackup/gobackup.yml`:

```yaml
models:
  my_backup:
    databases:
      mysql_db:
        type: mysql
        host: localhost
        database: my_database
        username: root
        password: password
    storages:
      s3:
        type: s3
        bucket: my_backup
        region: us-east-1
        access_key_id: $S3_ACCESS_KEY_ID
        secret_access_key: $S3_SECRET_ACCESS_KEY
```

## Web UI

Start daemon and visit http://127.0.0.1:2703 to manage backups.