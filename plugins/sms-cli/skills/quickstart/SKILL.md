# sms-cli Quickstart

Agent-friendly SMS sender. Non-interactive by design. Supports Twilio, Vonage, MailerSend, Clickatell.

## Schema Discovery

```bash
sms-cli --help-json
```

Returns full command schema: flags, env vars, exit codes.

## Send SMS

```bash
# Auto-detect provider from env
sms-cli send --to +15551234567 --message "Hello" --json

# Explicit provider
sms-cli send --to +15551234567 --message "Hello" --provider twilio --json

# Custom sender
sms-cli send --to +15551234567 --message "Hello" --provider vonage --from MyBrand --json
```

**Output (JSON):**
```json
{"version":"1.0","provider":"twilio","to":"+15551234567","from":"+18001234567","message_id":"SM123","status":"sent","timestamp":"2026-05-08T12:00:00.000Z"}
```

## Check Providers

```bash
# All providers
sms-cli providers list --json

# Single provider
sms-cli providers check twilio --json
```

## Environment Variables

| Var | Provider | Required |
|-----|----------|----------|
| `SMS_PROVIDER` | all | optional (auto-detect) |
| `TWILIO_ACCOUNT_SID` | twilio | yes |
| `TWILIO_AUTH_TOKEN` | twilio | yes |
| `TWILIO_FROM` | twilio | yes |
| `VONAGE_API_KEY` | vonage | yes |
| `VONAGE_API_SECRET` | vonage | yes |
| `VONAGE_FROM` | vonage | yes |
| `MAILERSEND_API_KEY` | mailersend | yes |
| `MAILERSEND_FROM` | mailersend | yes |
| `CLICKATELL_API_KEY` | clickatell | yes |
| `CLICKATELL_FROM` | clickatell | optional |
| `TELNYX_API_KEY` | telnyx | yes |
| `TELNYX_FROM` | telnyx | yes |

## Exit Codes

| Code | Meaning | Retry? |
|------|---------|--------|
| 0 | Success | - |
| 81 | Missing required flag | No — fix command |
| 82 | Invalid argument | No — fix command |
| 83 | Missing provider config | No — set env vars |
| 91 | Provider not found | No — fix provider name |
| 101 | API error | Yes |
| 102 | Auth failed | No — fix credentials |
| 105 | Timeout | Yes — retry after `retry_after` seconds |
| 111 | Internal error | No |

## Error Response Structure

```json
{
  "error": {
    "code": 83,
    "type": "missing_provider_config",
    "message": "No SMS provider configured.",
    "recoverable": false,
    "retry_after": null,
    "suggestions": ["Set SMS_PROVIDER=twilio and TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM"]
  }
}
```

## Agent Decision Logic

```
exit 0        → success, parse stdout JSON
exit 81-83    → don't retry, fix input/config
exit 91       → invalid provider name
exit 101,105  → retry with backoff (check retry_after field)
exit 102      → don't retry, fix credentials
exit 111      → report bug
```

## Stderr

Progress and warnings go to stderr, never stdout:
```
[sms-cli] Sending via twilio...
```

Suppress with `2>/dev/null` in pipelines.

## Pipe Composition

```bash
# Send to multiple recipients
echo -e "+15551234567\n+15559876543" | while read n; do
  sms-cli send --to "$n" --message "Alert!" --provider twilio --json
done

# Check if all providers are configured
sms-cli providers list --json | jq '[.providers[] | select(.configured == true)] | length'
```
