---
name: mergestat-lite
description: Use this skill when the user wants to run SQL queries on git repositories, analyze commit history, or generate reports about code authorship and changes.
---

# mergestat-lite Plugin

Run SQL queries on git repositories.

## Commands

### Query Execution
- `mergestat-lite query run` — Execute a SQL query on a repository
- `mergestat-lite query commits` — Query commits table

### Reports
- `mergestat-lite summarize commits` — Summarize commits with statistics

## Usage Examples
- "Count commits by author in this repo"
- "Show recent commits ordered by date"
- "Summarize all commits since January 2024"
- "Find all commits by user@email.com"

## SQL Tables Available
- `commits` — Git commits with hash, author, message, files
- `files` — Files in the repository
- `refs` — Branches and tags
- `blobs` — File contents

## Output Formats
- `-f json` — JSON array
- `-f ndjson` — Newline-delimited JSON
- `-f csv` — CSV

## Example Queries

```sql
-- Count commits by author
SELECT author_email, count(*) FROM commits GROUP BY author_email

-- Recent commits
SELECT * FROM commits ORDER BY author_when DESC LIMIT 10

-- Commits by specific author
SELECT * FROM commits WHERE author_email = 'test@example.com'
```

## Notes
- Local repos: use path to repo
- Remote repos: use GitHub/GitLab URL
- SQLite-powered under the hood