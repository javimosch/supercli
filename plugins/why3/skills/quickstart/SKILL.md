---
name: why3
description: why3 — deductive program verification platform for proving program correctness. Generates verification conditions from annotated programs and discharges them using automated theorem provers (Z3, Alt-Ergo, CVC4) or interactive proof assistants (Coq, Isabelle).
---

# why3 Plugin

why3 — deductive program verification platform for proving program correctness. Generates verification conditions from annotated programs and discharges them using automated theorem provers (Z3, Alt-Ergo, CVC4) or interactive proof assistants (Coq, Isabelle).

## Installation

```bash
brew install why3
Verify: why3 --version
```

## Commands

### `sc why3 self version`

Print why3 version

## Passthrough

```bash
sc why3 _ _ <args...>
```

## SuperCLI

```bash
sc why3 _ _ --help
sc plugins learn why3
```
