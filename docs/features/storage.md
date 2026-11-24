# Storage

supercli's backend persists all server data — jobs, plugins, settings, clients — through a key-value storage layer backed by local JSON files.

## Key Features

- **Key-Value Abstraction Layer**: A four-method interface (`get`, `set`, `delete`, `listKeys`) that all server features use.
- **Natural Entity Keys**: Data records use human-readable string IDs (e.g., `command:aws.cfn.deploy`, `job:1717849200000_abc1234`) instead of opaque ObjectIDs, making debugging and backup straightforward.
- **Zero-Dependency (`FileAdapter`)**: Writes `.json` files to a local directory. Local development and testing are frictionless, and the files are human-readable for debugging.

## Key-Value Interface

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `get(key) → object \| null` | Retrieve a record by key. Returns `null` if not found. |
| `set` | `set(key, value) → void` | Create or update a record. Upserts by default. |
| `delete` | `delete(key) → void` | Remove a record. No-op if key doesn't exist. |
| `listKeys` | `listKeys(prefix) → string[]` | List all keys matching a prefix. Empty array if none. |

**Key naming convention:** Keys follow a `type:identifier` pattern:
- `job:<timestamp>_<random>` — execution trace records
- `command:<namespace>.<resource>.<action>` — command registrations
- `plugin:<name>` — plugin metadata
- `client:<client_id>` — worker registrations / heartbeats
- `setting:<key>` — server settings

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `SUPERCLI_STORAGE_DIR` | `./supercli_storage` | Local directory for FileAdapter |

```bash
# Writes to ./supercli_storage/*.json
npm start
```

## FileAdapter Details

The FileAdapter stores each record as a separate JSON file:

```
supercli_storage/
├── command:aws.cfn.deploy.json
├── job:1717849200000_abc1234.json
├── job:1717849201000_def5678.json
├── plugin:github.json
└── setting:max_zip_mb.json
```

**Character sanitization:** Keys containing characters outside `[a-zA-Z0-9_.-]` are replaced with `_` in filenames. This is transparent — `get`/`set` work with the original key.

**Backup:** Since files are plain JSON, backing up FileAdapter data is as simple as copying the directory:

```bash
# Backup
cp -r ./supercli_storage ./supercli_storage_backup_$(date +%Y%m%d)

# Restore
cp -r ./supercli_storage_backup_20260608 ./supercli_storage
```

The storage directory is also Git-friendly — you can commit it for version-controlled configurations.

