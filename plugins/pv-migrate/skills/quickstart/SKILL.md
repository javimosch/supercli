---
name: pv-migrate
description: Use this skill when the user wants to migrate, backup, or restore Kubernetes persistent volumes.
---

# pv-migrate Plugin

CLI tool to easily migrate or backup/restore Kubernetes persistent volumes.

## Commands

### PVC
- `pv-migrate pvc migrate` — Migrate data from one PVC to another
- `pv-migrate pvc backup` — Backup a PVC to S3/Azure/GCS bucket storage
- `pv-migrate pvc restore` — Restore a PVC from bucket storage

## Usage Examples
- "Migrate data from one PVC to another"
- "Backup a Kubernetes persistent volume"
- "Restore a PVC from S3"
- "Move data between namespaces"

## Installation

```bash
brew install pv-migrate
```

## Examples

```bash
# Migrate PVC to a new larger PVC
pv-migrate migrate old-pvc new-pvc -n mynamespace

# Migrate across namespaces
pv-migrate migrate src-pvc dest-pvc -s src-ns -d dest-ns

# Backup to S3
pv-migrate backup my-pvc --s3-bucket my-backups --s3-path pvc-backups/

# Restore from S3
pv-migrate restore my-pvc --s3-bucket my-backups --s3-path pvc-backups/

# Cross-cluster migration via load balancer
pv-migrate migrate old-pvc new-pvc --strategies loadbalancer

# Push mode for firewall/NAT scenarios
pv-migrate migrate old-pvc new-pvc --rsync-push
```

## Key Features
- PVC-to-PVC migration (same or different namespaces)
- Cross-cluster data migration
- S3/Azure Blob/GCS bucket backup and restore
- Multiple transfer strategies (mount, clusterip, loadbalancer, nodeport, local)
- rsync over SSH with auto-generated keys
- Custom rclone remotes support
- Detach mode for large transfers
