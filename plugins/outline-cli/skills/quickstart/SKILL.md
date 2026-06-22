# Outline CLI Skill

Official CLI for the Outline wiki/knowledge base API. Full API coverage for documents, collections, search, and authentication with OAuth and OS keyring integration.

## Installation

```bash
npm install -g @doist/outline-cli
```

## Authentication

### OAuth (Recommended for Interactive Use)
```bash
ol auth login
# Opens browser for OAuth flow
# Token stored securely in OS keyring
```

### API Token (Headless/CI)
```bash
ol auth token --base-url <url> <token>
# Example: ol auth token --base-url https://outline.example.com ol_api_xxxxx
```

**Important**: The `--base-url` must match exactly the URL the token was generated for. Authentication verification will fail if URLs don't match.

### Check Authentication Status
```bash
ol auth status
```

## Common Workflows

### List Collections
```bash
ol collection list
ol collection list --json  # AI-friendly output
```

### Search Documents
```bash
ol search "query"
ol search "query" --limit 20 --collection <id>
```

### List Documents in Collection
```bash
ol document list --collection <id>
ol document list --collection <id> --sort updatedAt --limit 10
```

### Get Document Content
```bash
ol document get <documentId>          # Terminal rendering
ol document get <documentId> --raw    # Raw markdown
ol document get <documentId> --json  # JSON metadata
```

### Create Document
```bash
ol document create --title "Title" --collection <id> --file doc.md --publish
```

### Update Document
```bash
ol document update <documentId> --file updated.md
```

### Open in Browser
```bash
ol document open <documentId>
```

## AI Agent Integration

### JSON Output
Always use `--json` flag for machine-readable output:
```bash
ol collection list --json
ol document get <id> --json
ol search "query" --json
```

### Common Patterns for Agents
```bash
# Search and get content
ol search "topic" --json | jq -r '.[].urlId' | xargs -I {} ol document get {} --raw

# List documents in specific collection
ol document list --collection <id> --json

# Get document metadata only
ol document get <id> --json
```

## Caveats and Gotchas

### Base URL Matching
- API tokens are tied to specific base URLs
- Authentication verification fails if `--base-url` doesn't match exactly
- Common issue: Including or excluding trailing slashes
- Example: `https://outline.example.com` vs `https://outline.example.com/`

### Authentication Verification
- First authentication requires network access to Outline instance
- Token verification happens on save
- If verification fails, check:
  - Token validity
  - Base URL exact match
  - Network connectivity to Outline instance

### Document IDs vs URLs
- Commands accept either document URL IDs (short) or full URLs
- URL IDs look like: `LuW3bpbs3H`
- Full URLs: `https://outline.example.com/doc/title-LuW3bpbs3H`
- Use URL IDs for cleaner commands

### Collection IDs
- Collection IDs are UUIDs: `5bffa199-ab84-4bab-a2d3-8c926e6b17d4`
- Get IDs from `ol collection list --json`

### JSON Output Variations
- `--json` provides structured data but fields vary by command
- Use `jq` or similar tools for parsing
- Some commands have `--full` flag for additional fields

### OAuth Token Refresh
- OAuth tokens refresh automatically when expired
- API tokens don't auto-refresh and may need manual updates
- `ol auth status` shows current authentication state

## Key Commands Reference

| Command | Description |
|---------|-------------|
| `ol auth login` | OAuth authentication (browser) |
| `ol auth token --base-url <url> <token>` | API token authentication |
| `ol auth status` | Check authentication state |
| `ol collection list` | List all collections |
| `ol collection get <id>` | Get collection details |
| `ol search <query>` | Search documents |
| `ol document list --collection <id>` | List documents in collection |
| `ol document get <id>` | Get document content/metadata |
| `ol document create --title <t> --collection <id>` | Create new document |
| `ol document update <id> --file <file>` | Update document |
| `ol document open <id>` | Open in browser |

## Use Cases

- **Documentation workflow automation**: Script document creation and updates
- **Knowledge base management**: Bulk operations on collections and documents
- **CI/CD integration**: Automated documentation updates from code
- **AI agent integration**: Programmatic access to knowledge base for RAG systems
- **Content migration**: Import/export documents between systems

## Notes

- Requires Node.js 18+
- Tokens stored securely in OS keyring (OAuth) or secure-store (API tokens)
- Multi-user support via `--user` flag for account switching
- Terminal-friendly markdown rendering for human consumption
- JSON output optimized for AI agent integration