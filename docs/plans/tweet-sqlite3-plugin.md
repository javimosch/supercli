# Plan: Publish Tweet About sqlite3 Plugin Release

## Context

- sqlite3 plugin has been committed and pushed to master
- Tweet announcement needs to be published
- No Twitter posting capability currently exists in supercli (xurl/clix are read-only)

---

## Proposed Steps

| Step | Action | Details |
|------|--------|---------|
| 1 | **Choose Twitter tool** | Evaluate options: xurl upgrade, clix upgrade, or direct Twitter API v2 |
| 2 | **Set up auth** | Configure OAuth/API keys for posting |
| 3 | **Draft tweet** | Compose announcement text |
| 4 | **Post tweet** | Execute via selected tool |

---

## Tweet Draft

```
Just released the sqlite3 plugin for @supercli 

Execute SQL queries, manage transactions, pragmas, import/export CSV, and more — all returning JSON by default.

#sqlite #database #cli
```

---

## Open Questions

1. **Which tool to use for posting?**
   - xurl has no post capability (read-only)
   - clix has no post capability (read-only)
   - Direct Twitter API v2 with `curl` could work
   - Alternative: Use a third-party tool like `twurl` or `t`

2. **Auth setup**: What credentials are available? Twitter Developer Account with OAuth tokens?

3. **Account**: Which X account should post? @supercli, @javimosch, or another?

---

## Dependencies

- Twitter Developer Account with OAuth 1.0a or OAuth 2.0 credentials
- API key, API secret, Access token, Access token secret (for OAuth 1.0a)
- Or: Bearer token (for OAuth 2.0 with App-only auth - but this can't post)
