Here’s a **storage adapter design** (example) for DCLI that supports **MongoDB** and **file-based JSON storage**, with a clean, pluggable interface. It keeps the CLI/server storage-agnostic so MongoDB is **optional**.

---

## 1. **Storage Adapter Interface**

```ts
// storage-adapter.ts
export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  listKeys(prefix?: string): Promise<string[]>;
}
```

* `key`: unique identifier (string).
* `value`: any serializable JSON object.
* `prefix`: optional filter for `listKeys`.

---

## 2. **MongoDB Adapter**

```ts
// mongo-adapter.ts
import { MongoClient, Db, Collection } from "mongodb";
import { StorageAdapter } from "./storage-adapter";

export class MongoAdapter implements StorageAdapter {
  private db: Db;
  private collection: Collection;

  constructor(uri: string, dbName: string = "dcli", collectionName: string = "storage") {
    const client = new MongoClient(uri);
    this.db = client.db(dbName);
    this.collection = this.db.collection(collectionName);
  }

  async get(key: string): Promise<any> {
    const doc = await this.collection.findOne({ _id: key });
    return doc ? doc.value : null;
  }

  async set(key: string, value: any): Promise<void> {
    await this.collection.updateOne(
      { _id: key },
      { $set: { value } },
      { upsert: true }
    );
  }

  async delete(key: string): Promise<void> {
    await this.collection.deleteOne({ _id: key });
  }

  async listKeys(prefix: string = ""): Promise<string[]> {
    const docs = await this.collection.find({ _id: { $regex: `^${prefix}` } }).toArray();
    return docs.map(doc => doc._id);
  }
}
```

---

## 3. **File-Based JSON Adapter**

```ts
// file-adapter.ts
import { promises as fs } from "fs";
import { join } from "path";
import { StorageAdapter } from "./storage-adapter";

export class FileAdapter implements StorageAdapter {
  constructor(private baseDir: string = "./dcli_storage") {}

  private filePath(key: string) {
    return join(this.baseDir, `${key}.json`);
  }

  async get(key: string): Promise<any> {
    try {
      const data = await fs.readFile(this.filePath(key), "utf-8");
      return JSON.parse(data);
    } catch (e) {
      if (e.code === "ENOENT") return null;
      throw e;
    }
  }

  async set(key: string, value: any): Promise<void> {
    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.writeFile(this.filePath(key), JSON.stringify(value, null, 2), "utf-8");
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(this.filePath(key));
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
  }

  async listKeys(prefix: string = ""): Promise<string[]> {
    try {
      const files = await fs.readdir(this.baseDir);
      return files
        .filter(f => f.endsWith(".json") && f.startsWith(prefix))
        .map(f => f.replace(/\.json$/, ""));
    } catch (e) {
      if (e.code === "ENOENT") return [];
      throw e;
    }
  }
}
```

---

## 4. **Adapter Selection in DCLI**

```ts
// storage.ts
import { StorageAdapter } from "./storage-adapter";
import { MongoAdapter } from "./mongo-adapter";
import { FileAdapter } from "./file-adapter";

export function createStorageAdapter(): StorageAdapter {
  const useMongo = process.env.DCLI_USE_MONGO === "true";
  if (useMongo) {
    return new MongoAdapter(process.env.MONGO_URI || "mongodb://localhost:27017");
  } else {
    return new FileAdapter(process.env.DCLI_STORAGE_DIR || "./dcli_storage");
  }
}
```

* Toggle storage backend via **environment variable**.
* File-based storage works out-of-the-box with **no external dependency**.

---

## ✅ Benefits

1. **Pluggable** – easy to add Redis, SQLite, or other adapters.
2. **Optional MongoDB** – no hard dependency for local/dev users.
3. **OSS-Friendly** – file storage works immediately for open-source demos.
4. **Unified Interface** – DCLI logic doesn’t care which storage is used.
5. **Namespace-Friendly** – `listKeys(prefix)` supports scoped storage per command/project.

---

If you want, I can **extend this design** to support **DAG storage and versioned metadata**, so DAGs, results, and side-effect info can also be persisted in either MongoDB or file JSON transparently.

Do you want me to do that next?
