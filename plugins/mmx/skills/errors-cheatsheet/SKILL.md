---
name: mmx.errors-cheatsheet
description: Complete mmx CLI error reference — every command's error scenarios, exit codes, and quick-fix resolutions.
tags: mmx,minimax,errors,debugging,exit-codes,troubleshooting
---

# mmx Errors Cheatsheet

Complete reference of mmx CLI error scenarios and resolutions.

## Exit Codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | General error |
| 2 | Usage error (invalid arguments) |
| 3 | Authentication error |
| 4 | Quota exceeded |
| 5 | Timeout |
| 6 | Network error |
| 10 | Content filter triggered |
| 130 | Interrupted (Ctrl+C / SIGINT) |

## Auth Errors

| Scenario | Message |
|---|---|
| `--method api-key` without `--api-key` flag | `--api-key is required when using --method api-key.` |
| API key validation failed | `API key validation failed.` |
| OAuth timeout (120s) | `OAuth callback timed out.` |
| OAuth state mismatch | `Invalid OAuth callback.` |
| OAuth token exchange failed | `OAuth token exchange failed: ${body}` |
| No credentials on logout | `No credentials to clear.` |
| Refresh with api-key mode | `Not applicable: not authenticated via OAuth.` |
| Refresh token expired | `OAuth session expired and could not be refreshed.` |

**Resolution**: Run `mmx auth logout && mmx auth login --api-key sk-xxxxx`

## Text Chat Errors

| Scenario | Message |
|---|---|
| No `--message` in non-interactive mode | `Missing required argument: --message` |
| `--messages-file` not found | `File not found: ${filePath}` |
| `--messages-file` invalid JSON | `--messages-file content is not valid JSON.` |
| `--tool` not valid JSON | `--tool argument "${t}" is not valid JSON.` |
| `--tool` file not found | `Tool definition file not found: ${t}` |
| `--tool` file invalid JSON | `Tool definition file "${t}" contains invalid JSON.` |
| Stream disconnected | `Stream disconnected before response completed.` |

## Image Errors

| Scenario | Message |
|---|---|
| No `--prompt` in non-interactive mode | `Missing required argument: --prompt` |
| `--subject-ref` image not found | `Subject reference image not found: ${params.image}` |
| `--subject-ref` unreadable | `Cannot read image file: ${e.message}` |
| `--out-dir` no write permission | `Permission denied: cannot create directory "${outDir}".` |
| All images rejected | `Image generation failed: all images were rejected (content policy or model error).` |

## Video Errors

| Scenario | Message |
|---|---|
| No `--prompt` in non-interactive mode | `Missing required argument: --prompt` |
| `--first-frame` not found | `First-frame image not found: ${framePath}` |
| `--first-frame` unreadable | `Cannot read image file: ${e.message}` |
| Task Failed | `Task Failed: ${status_msg}` |
| Task Unknown | `Task Unknown: ${status_msg}` |
| No `file_id` returned | `Task completed but no file_id returned.` |
| No download URL | `No download URL available for this file.` |
| Polling timeout | `Polling timed out.` |
| Download interrupted | `Network request failed.` |
| Disk full | `Disk full — cannot write video file.` |
| No `--task-id` | `--task-id is required.` |
| No `--file-id` | `--file-id is required.` |
| No `--out` | `--out is required.` |

## Speech Errors

| Scenario | Message |
|---|---|
| No `--text` and no `--text-file` | `--text or --text-file is required.` |
| `--text-file` not found | `File not found: ${flags.textFile}` |
| `--text-file` unreadable | `Cannot read file: ${e.message}` |
| `--out` no write permission | `Permission denied: cannot write to "${outPath}".` |
| Disk full | `Disk full — cannot write audio file.` |

## Music Errors

| Scenario | Message |
|---|---|
| Neither `--prompt` nor `--lyrics` | `At least one of --prompt or --lyrics is required.` |
| `--lyrics-file` not found | `File not found: ${flags.lyricsFile}` |
| `--lyrics-file` unreadable | `Cannot read file: ${e.message}` |
| `--out` no write permission | `Permission denied: cannot write to "${outPath}".` |
| Disk full | `Disk full — cannot write audio file.` |

## Vision Errors

| Scenario | Message |
|---|---|
| Neither `--image` nor `--file-id` | `Missing required argument. Must provide either --image or --file-id.` |
| Both `--image` and `--file-id` | `Conflicting arguments: cannot provide both --image and --file-id.` |
| Local image not found | `File not found: ${image}` |
| Unsupported image format | `Unsupported image format "${ext}". Supported: jpg, jpeg, png, webp` |
| Remote image download failed | `Failed to download image: HTTP ${res.status}` |

## Search Errors

| Scenario | Message |
|---|---|
| No `--q` in non-interactive mode | `--q is required.` |

## Config Errors

| Scenario | Message |
|---|---|
| `--key` or `--value` missing | `--key and --value are required.` |
| Invalid config key | `Invalid config key "${key}". Valid keys: region, base_url, output, timeout, api_key` |
| Invalid region value | `Invalid region "${value}". Valid values: global, cn` |
| Invalid output format | `Invalid output format "${value}". Valid values: text, json` |
| Invalid timeout | `Invalid timeout "${value}". Must be a positive number.` |
| Unknown command in export-schema | `Command "${targetCommand}" not found.` |

## Global Errors (All Commands)

### Network Errors

| Scenario | Message |
|---|---|
| Connection failure | `Network request failed.` |
| Proxy error | `Network request failed.` + hint to check `HTTP_PROXY`/`HTTPS_PROXY` |
| Request timeout | `Request timed out.` |
| HTTP 408/504 | `Request timed out (HTTP ${status}).` |

### API Errors

| Scenario | Message |
|---|---|
| HTTP 401/403 | `API key rejected (HTTP ${status}).` |
| HTTP 429 | `Rate limit or quota exceeded. ${apiMsg}` |
| Content filter (1002/1039) | `Input content flagged by sensitivity filter (${filterType}).` |
| Quota exhausted (1028/1030) | `Quota exhausted. ${apiMsg}` |
| Model not on plan (2061) | `This model is not available on your current Token Plan. ${apiMsg}` |
| Non-JSON response (e.g. 502) | `API returned non-JSON response (${contentType}). Server may be experiencing issues.` |

### File System Errors

| Scenario | Message |
|---|---|
| File not found | `File system error: ENOENT: no such file or directory...` |
| Permission denied | `File system error: EACCES: permission denied...` |
| Disk full | `File system error: ENOSPC: no space left on device...` |

### Config/Credentials File Corruption

| Scenario | Behavior |
|---|---|
| `~/.mmx/credentials.json` corrupted | Warning to stderr; treated as no credentials |
| `~/.mmx/config.json` corrupted | Warning to stderr; treated as empty config |

## Quick Fix Reference

| Problem | Fix |
|---|---|
| Auth error | `mmx auth logout && mmx auth login --api-key sk-xxxxx` |
| Quota exceeded | `mmx quota show` to check usage |
| Network error | Check `HTTP_PROXY`/`HTTPS_PROXY` env vars |
| Content filter | Modify prompt; avoid flagged topics |
| Timeout | Use `--async` for videos; increase timeout in config |
| Model not on plan | Upgrade Token Plan or use default model |
