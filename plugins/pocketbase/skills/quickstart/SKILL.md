# PocketBase Plugin Skill

PocketBase open-source backend as a single file with Go-based SQLite database, real-time subscriptions, and built-in admin UI.

## Quick Start

```bash
# Install pocketbase binary
# macOS: brew install pocketbase
# Linux: Download from https://pocketbase.io/docs

# Add to PATH if needed
export PATH="$HOME/.local/bin:$PATH"

# Start server (development mode)
sc pocketbase self serve

# Or background with logging
nohup sc pocketbase self serve > /tmp/pocketbase.log 2>&1 &
```

## Core Commands

### Server Management
```bash
# Start development server
sc pocketbase self serve

# Check version
sc pocketbase --version

# View help
sc pocketbase --help
```

### Collection Management
```bash
# Set auth credentials
export POCKETBASE_EMAIL="admin@example.com"
export POCKETBASE_PASSWORD="password123"
export POCKETBASE_URL="http://127.0.0.1:8090"

# List all collections
sc pocketbase collection list

# Create new collection
sc pocketbase collection create mycollection
sc pocketbase collection create users auth  # for auth collection

# Delete collection
sc pocketbase collection delete pbc_1234567890
```

### Database Operations
```bash
# Run migrations
sc pocketbase migrate up

# Create migration file
sc pocketbase migrate create add_user_fields

# Revert migrations
sc pocketbase migrate down 1

# Sync migrations history
sc pocketbase migrate history-sync
```

### Superuser Management
```bash
# Create superuser
sc pocketbase superuser create admin@example.com password123

# Update superuser password
sc pocketbase superuser update admin@example.com newpassword123

# Delete superuser
sc pocketbase superuser delete admin@example.com

# Create OTP for superuser
sc pocketbase superuser otp admin@example.com
```

### Passthrough Commands
Any pocketbase CLI command works via passthrough:
```bash
sc pocketbase serve --dev
sc pocketbase migrate up
sc pocketbase superuser upsert email@domain.com password123
```

## Caveats & Pitfalls

### 1. Server Process Management
**Issue:** Long-running server commands timeout in supercli's default execution model.

**Solution:** Use background execution or nohup:
```bash
# Good: Background with logging
nohup sc pocketbase self serve > /tmp/pocketbase.log 2>&1 &

# Monitor logs
tail -f /tmp/pocketbase.log

# Stop server
pkill pocketbase
```

### 2. Binary Installation
**Issue:** `brew install pocketbase` only works on macOS. Linux requires manual download.

**Solution:** Download directly from GitHub releases:
```bash
# Linux AMD64
curl -LO https://github.com/pocketbase/pocketbase/releases/download/v0.23.5/pocketbase_0.23.5_linux_amd64.zip
unzip pocketbase_0.23.5_linux_amd64.zip
chmod +x pocketbase
mv pocketbase ~/.local/bin/
```

### 3. Collection Schema Creation
**Issue:** Admin API schema creation via curl is complex and error-prone. PocketBase expects specific field formats.

**Solution:** Use PocketBase migrations for schema changes:
```javascript
// pb_migrations/TIMESTAMP_schema_name.js
migrate((app) => {
  const collection = app.findCollectionByNameOrId("mycollection");
  
  const titleField = new TextField({
    "name": "title",
    "required": true,
    "presentable": true
  });
  collection.fields.push(titleField);
  
  app.save(collection);
}, (app) => {
  // Revert logic
  const collection = app.findCollectionByNameOrId("mycollection");
  collection.removeField("title");
  app.save(collection);
});
```

Then apply: `sc pocketbase migrate up`

### 4. Authentication Required
**Issue:** Most API operations require superuser authentication, not just basic HTTP access.

**Solution:** Set environment variables for collection management:
```bash
export POCKETBASE_EMAIL="admin@example.com"
export POCKETBASE_PASSWORD="password123"
export POCKETBASE_URL="http://127.0.0.1:8090"
```

### 5. Collection ID vs Name
**Issue:** Operations like delete require collection ID (pbc_*), not name.

**Solution:** List collections first to get IDs:
```bash
# List to find ID
sc pocketbase collection list | jq '.items[] | select(.name=="todos") | .id'

# Then delete with ID
sc pocketbase collection delete pbc_1234567890
```

### 6. Development vs Production
**Issue:** Development mode (`--dev`) prints SQL queries and logs, not suitable for production.

**Solution:** 
```bash
# Development (with logs)
sc pocketbase self serve

# Production (without --dev flag)
sc pocketbase serve
```

### 7. Data Directory Location
**Issue:** PocketBase creates `pb_data` directory in current working directory by default.

**Solution:** Specify data directory explicitly:
```bash
sc pocketbase serve --dir /path/to/data
```

### 8. Port Conflicts
**Issue:** Default port 8090 may conflict with other services.

**Solution:** Use custom HTTP port:
```bash
sc pocketbase serve --http 0.0.0.0:3000
```

### 9. Migration File Naming
**Issue:** Migration files need unique timestamps to avoid conflicts.

**Solution:** Use Unix timestamp in filename:
```bash
# Current timestamp in milliseconds
date +%s%3N  # e.g., 1778761000

# Create migration with timestamp
sc pocketbase migrate create 1778761000_add_fields
```

### 10. Relation Field Complexity
**Issue:** Relation fields require exact collection IDs and proper configuration.

**Solution:** Always reference collections by ID, not name:
```javascript
const categoryField = new RelationField({
  "name": "category",
  "collectionId": "pbc_3292755704",  // Use exact ID
  "maxSelect": 1,
  "minSelect": 0,
  "presentable": true
});
```

## Best Practices

### 1. Environment Setup
```bash
# Add to .bashrc or .zshrc
export PATH="$HOME/.local/bin:$PATH"
export POCKETBASE_EMAIL="admin@example.com"
export POCKETBASE_PASSWORD="password123"
export POCKETBASE_URL="http://127.0.0.1:8090"
```

### 2. Database Schema Management
- Always use migrations for schema changes
- Test migrations in development first
- Keep migration files reversible
- Use descriptive migration names

### 3. Server Management
- Use process manager (systemd, PM2) for production
- Monitor logs for errors
- Set up proper backup strategy for `pb_data` directory
- Use environment variables for configuration

### 4. API Rules
- Set appropriate API rules in admin UI for security
- Use `@request.auth.id` for authenticated requests
- Test API rules before deploying
- Document your API rule patterns

### 5. Development Workflow
```bash
# 1. Start server
sc pocketbase self serve

# 2. Create migration for schema changes
sc pocketbase migrate create feature_name

# 3. Edit migration file
vim pb_migrations/TIMESTAMP_feature_name.js

# 4. Apply migration
sc pocketbase migrate up

# 5. Test in admin UI
open http://127.0.0.1:8090/_/

# 6. If needed, revert migration
sc pocketbase migrate down 1
```

## Troubleshooting

### Server Won't Start
```bash
# Check if pocketbase binary exists
which pocketbase

# Check if port is in use
lsof -i :8090

# Try different port
sc pocketbase serve --http 0.0.0.0:3000
```

### Migration Errors
```bash
# Check migration status
sc pocketbase migrate history-sync

# Revert failed migration
sc pocketbase migrate down 1

# Fix migration file and reapply
sc pocketbase migrate up
```

### Collection Management Issues
```bash
# Verify authentication
curl -X POST http://127.0.0.1:8090/api/collections/_superusers/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity":"admin@example.com","password":"password123"}'

# Check server logs
tail -f /tmp/pocketbase.log
```

### Data Not Persisting
```bash
# Check data directory permissions
ls -la pb_data/

# Ensure data directory is writable
chmod -R 755 pb_data/

# Specify explicit data directory
sc pocketbase serve --dir ./pb_data
```

## Admin UI Access

- **Dashboard:** http://127.0.0.1:8090/_/
- **API:** http://127.0.0.1:8090/api/
- **Default Superuser:** Created via CLI or admin UI on first visit

## Plugin Architecture

The plugin uses:
- **Process adapter** for CLI passthrough commands
- **Custom Node.js scripts** for complex operations (collection-manager.js, serve.js)
- **Environment variables** for configuration (POCKETBASE_EMAIL, etc.)
- **Migration files** for schema management

## Advanced Usage

### Custom Hooks
```javascript
// pb_hooks/main.go
package hooks

import (
    "github.com/pocketbase/pocketbase/apis"
    "github.com/pocketbase/pocketbase/tools/types"
)

func (e *BootstrapEvent) Bootstrap(e *BootstrapEvent) error {
    // Custom bootstrap logic
    return e.Next()
}
```

### Real-time Subscriptions
```javascript
// Client-side subscription
const pb = new PocketBase('http://127.0.0.1:8090');

pb.collection('todos').subscribe('*', function(e) {
    console.log(e.action, e.record);
});
```

### Backup Strategy
```bash
# Backup data directory
tar -czf pocketbase-backup-$(date +%Y%m%d).tar.gz pb_data/

# Restore backup
tar -xzf pocketbase-backup-20240514.tar.gz
```

## Resources

- **Official Docs:** https://pocketbase.io/docs/
- **GitHub:** https://github.com/pocketbase/pocketbase
- **Examples:** https://github.com/pocketbase/pocketbase/examples
- **Community:** https://pocketbase.io/docs/go-overview/