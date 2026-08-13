---
name: inbox-watch-quickstart
description: Poll GitHub, IMAP and Resend inbound for genuinely new items and alert only when a human actually replied. Use when setting up reply monitoring, wiring a cron/timer to an inbox, or debugging why an expected alert never fired.
---

# inbox-watch

**Tells you only when a human actually replied.** Polls GitHub notifications, IMAP
and Resend inbound; prints what is new since the last run; **exits 10** if there
was anything — so a cron alerts only when something real arrived.

## The one idea

Inbound is mostly machine noise. On a domain with DMARC reporting on, aggregate
reports outnumber real mail several to one. A notifier that pings for all of it
gets muted — **and then the reply that mattered is muted with it.** So every item
is classified and only one kind is a person:

| kind | alert? |
|---|---|
| `dmarc` | no — counted, never pinged alone |
| `autoreply` | yes, but **labelled** so it doesn't read as a reply |
| `reply` | **yes** — this is the product |

## Use

```sh
inbox-watch                       # JSON on stdout, exit 10 if new
inbox-watch --human               # readable lines
inbox-watch guide                 # embedded operator manual
inbox-watch help-json             # command catalog
inbox-watch setup                 # what each channel needs
```

Output follows [cli-output-spec](https://cli-specs.intrane.fr/): stdout is
versioned data, stderr is context and typed errors, exit code is the signal.

```json
{ "ok": true, "version": "1.0.0", "count": 1,
  "new": [ { "channel": "mailbox", "kind": "reply", "from": "…", "title": "…" } ],
  "disabled": [ { "channel": "resend", "reason": "set RESEND_API_KEY …", "recoverable": true } ] }
```

| exit | meaning |
|---:|---|
| 0 | nothing new |
| **10** | **new items — the cron signal** |
| 80 / 90 / 100 / 110 | input / precondition / external / internal |

## Two traps — read these before debugging

Both were found in production, and both make a *working* system look broken (or
a broken one look fine).

**1. The cursor is consumed on read.** Any normal run marks items seen. So
running `inbox-watch` by hand to "check if it works" **eats the alert the cron
would have sent** — and the cron then reports nothing, which looks like success.

> Use `--peek` for anything diagnostic. It reports identically without
> committing state.

**2. Two watchers on one host steal from each other.** Same cause: they share a
cursor, so whichever polls first wins and the other's alert never fires.

> Give each its own: `--consumer NAME`. Run `--seed` once for a new consumer, or
> its first run alerts on the entire backlog.

```sh
inbox-watch --peek --human            # safe diagnosis
inbox-watch --consumer laptop --seed  # add a second watcher, no backlog flood
inbox-watch --consumer laptop
```

## Configure

`~/.inbox-watch/config.json` holds **what to watch**; env vars hold **every
secret**. Start from `config.example.json`. Unconfigured channels report why
they are disabled rather than failing, so a fresh install runs and tells you
what it needs.

| channel | secret | note |
|---|---|---|
| `mailbox` | `INBOX_TOKEN` + `mailbox.url` | token-gated `GET /api/inbound`. **Prefer this over `resend`** — a read-only token cannot send mail as you |
| `resend` | `RESEND_API_KEY` | note this key *can also send* |
| `imap` | `ZOHO_IMAP_PASS` + `imap.user` | any IMAP host, app-specific password |
| `github` | authenticated `gh` | mentions/review-requests, plus specific issue/PR threads you name |

## Wire it up

```
*/15 * * * *  inbox-watch --human | grep . && <notify>
```

`run.sh.template` in the repo is a worked example (Telegram). It **logs the
delivery result** — a send that fails silently is the same failure mode this
tool exists to prevent, so don't discard it.
