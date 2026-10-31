---
name: terminal-notifier
description: terminal-notifier — send macOS Notification Center alerts from the command line. Trigger native notifications with custom titles, subtitles, messages, icons, sound effects, and action buttons. Ideal for notifying when long-running commands complete or CI jobs finish.
---

# terminal-notifier Plugin

terminal-notifier — send macOS Notification Center alerts from the command line. Trigger native notifications with custom titles, subtitles, messages, icons, sound effects, and action buttons. Ideal for notifying when long-running commands complete or CI jobs finish.

## Installation

```bash
brew install terminal-notifier
Verify: terminal-notifier --version
```

## Commands

### `sc terminal-notifier self version`

Print terminal-notifier version

## Passthrough

```bash
sc terminal-notifier _ _ <args...>
```

## SuperCLI

```bash
sc terminal-notifier _ _ --help
sc plugins learn terminal-notifier
```
