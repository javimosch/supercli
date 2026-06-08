# Pluggable Storage

supercli's backend uses a pluggable key-value storage layer. By default it writes JSON files locally, with an option to switch to MongoDB for production deployments. All server data — jobs, plugins, settings — flows through this single abstraction.

## Key Features

- **Key-Value Abstraction Layer**: A four-method interface (`get`, `set`, `delete`, `listKeys`) that all server features use. Swapping backends requires zero changes to application code.
- **Natural Entity Keys**: Data records use human-readable string IDs (e.g., `command:aws.cfn.deploy`, `job:1717849200000_abc1234`) instead of opaque ObjectIDs, making debugging and backup straightforward.
- **Zero-Dependency Default (`FileAdapter`)**: Without MongoDB configured, supercli writes `.json` files to a local directory. This makes local development and testing frictionless, and the files are human-readable for debugging.
- **Production Scale (`MongoAdapter`)**: Setting `SUPERCLI_USE_MONGO=true` enables MongoDB persistence for concurrent, high-availability deployments with proper indexing.

## Key-Value Interface

Both adapters implement the same four methods:

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
- `setting:<key>` — server settings

## Configuration

The storage adapter is selected by environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `SUPERCLI_USE_MONGO` | `false` | Set to `true` to use MongoDB |
| `MONGO_URL` | `mongodb://localhost:27017` | MongoDB connection URI |
| `SUPERCLI_DB` | `supercli` | MongoDB database name |
| `SUPERCLI_STORAGE_DIR` | `./supercli_storage` | Local directory for FileAdapter |

## Usage

```bash
# Default: FileAdapter — writes to ./supercli_storage/*.json
npm start

# Production: MongoDB adapter
export SUPERCLI_USE_MONGO=true
export MONGO_URL=mongodb://127.0.0.1:27017
export SUPERCLI_DB=supercli
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

## MongoAdapter Details

The MongoDB adapter stores all records in a single `storage` collection:

```json
{ "_id": "job:1717849200000_abc1234", "value": { "command": "aws.cfn.deploy", ... } }
{ "_id": "setting:max_zip_mb", "value": 10 }
```

**Indexing:** The `_id` field is automatically indexed by MongoDB, providing efficient key lookups and prefix queries via regex.

**Connection pooling:** The adapter connects lazily on first use and reuses the connection for subsequent operations.

## Migration: File → MongoDB

To migrate from FileAdapter to MongoDB:

```bash
# 1. Ensure MongoDB is running and accessible
mongosh --eval "db.stats()"

# 2. Set environment variables
export SUPERCLI_USE_MONGO=true
export MONGO_URL=mongodb://127.0.0.1:27017
export SUPERCLI_DB=supercli

# 3. Import existing data (one-time script)
node -e "
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

async function migrate() {
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  const db = client.db(process.env.SUPERCLI_DB);
  const col = db.collection('storage');
  
  const dir = './supercli_storage';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const key = file.replace('.json', '');
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    await col.updateOne({ _id: key }, { \$set: { value: data } }, { upsert: true });
    console.log('Migrated:', key);
  }
  
  await client.close();
  console.log('Migration complete:', files.length, 'records');
}
migrate().catch(console.error);
"

# 4. Restart the server — it will now use MongoDB
npm start
```

**Verification:**

```bash
# Check record count in MongoDB
mongosh supercli --eval "db.storage.countDocuments()"

# Compare with file count
ls ./supercli_storage/*.json | wc -l
```

## When to Use Each Adapter

| Scenario | Recommended Adapter |
|----------|-------------------|
| Local development | FileAdapter (default) |
| Single-user deployment | FileAdapter |
| CI/CD testing | FileAdapter |
| Multi-user team server | MongoAdapter |
| High-availability production | MongoAdapter |
| Air-gapped / offline | FileAdapter |
