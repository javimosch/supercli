---
name: humanenv-usage
description: Use humanenv to retrieve sensitives/envs. Never log/read sensitives from humanenv. They are envs for humans only.
---

## How to retrieve sensitives

### JavaScript API
Use `humanenv.get('key')` inside your application. The returned value must be used immediately and then set to `null` to prevent memory leaks.

### CLI (non-TTY mode)
Only non-API-mode envs are accessible. Do not attempt to use this to log or dump all envs.

## Rules
1. NEVER log env values retrieved from humanenv
2. NEVER dump or export multiple values at once
3. ALWAYS null variables after use
4. NEVER write sensitives to files
5. Do not generate scripts that use humanenv in loops or to exfiltrate data