---
name: claude-red
description: Use this skill when the user needs offensive security expertise — penetration testing, vulnerability assessment, red team operations, bug bounty hunting, or security research for authorized engagements.
---

# Claude-Red — Offensive Security Skills Library

58 curated SKILL.md files across 13 categories that prime AI agents with expert-level offensive security methodology. Built by SnailSploit.

## Installation

```bash
git clone https://github.com/SnailSploit/Claude-Red.git
sc skills teach claude-red:quickstart
```

## Categories (58 Skills)

### Web Application (16 skills)
SQLi (error/blind/OOB, DB-specific), XSS (stored/reflected/DOM/mutation), SSRF (cloud metadata, filter bypass), SSTI (engine ID, RCE paths), XXE (OOB exfil, blind), IDOR (enumeration, business logic), File Upload (extension bypass, polyglots, webshells), RCE (chaining, command injection), Deserialization (Java/PHP/.NET gadget chains), Race Conditions (TOCTOU, single-packet), Request Smuggling (CL.TE, TE.CL, h2 desync), Open Redirect, Parameter Pollution, GraphQL (introspection, batching, alias IDOR), WAF Bypass, Business Logic

### Auth & Identity (2 skills)
JWT (alg:none, key confusion, secret cracking), OAuth (redirect abuse, token leakage, PKCE bypass)

### Active Directory (1 skill, expanding to 16)
Kerberoast, ASREProast, ACL abuse, ADCS ESC1-15, delegation, persistence, hybrid AAD

### Wireless (13 skills)
WPA2-PSK (handshake, PMKID, hashcat), WPA3-SAE (downgrade, Dragonblood), WPA Enterprise (802.1X/EAP, eaphammer), WPS (Pixie Dust, brute), Evil Twin (KARMA, Mana, captive portal), KRACK/FragAttacks, Deauth, Bluetooth/BLE, Bluetooth Classic, Zigbee/Thread/Matter, Z-Wave, LoRaWAN/sub-GHz

### Cloud (1 skill)
AWS/Azure/GCP — privesc, IMDS, cross-account, CSPM evasion

### Mobile (1 skill)
Android + iOS — Frida, pinning bypass, storage, biometric, deep links

### IoT & Embedded (1 skill, expanding to 10)
Hardware recon, firmware, RTOS, ICS/OT, MQTT/CoAP

### Infrastructure & Red Team (7 skills)
Initial Access (phishing, drive-by, supply chain), Advanced Red Team (full kill chain, C2, OPSEC), EDR Evasion (unhooking, indirect syscalls, PPID spoofing), Shellcode (writing, encoding, injection), Keylogger Architecture, Windows Mitigations (ACG, Arbitrary Code Guard), Windows Boundaries (sandbox escape)

### Exploit Development (6 skills)
Stack/Heap, ROP chains, Mitigations, Structured Curriculum, Basic Exploitation (Linux), Crash Analysis, TOCTOU

### Fuzzing & Vulnerability Research (4 skills)
libFuzzer/AFL++, Coverage-Guided, Bug Identification, Vulnerability Classes

### Reconnaissance (2 skills)
OSINT Tools (recon-ng, theHarvester, Maltego), OSINT Methodology

### AI Security (1 skill)
Prompt injection, jailbreaking, RAG poisoning, LLM pentesting

### Utility (2 skills)
Fast Triage Checklist, Professional Pentest Reporting (CVSS, evidence, exec summary)

## Usage Prompts

- "I found a SQL injection in a login form. How do I exploit it blind?"
- "Walk me through ADCS ESC1 abuse chain"
- "I need to bypass EDR for my red team engagement"
- "Help me write a ROP chain for a modern x64 binary"
- "What's the methodology for WPA3 Dragonblood attack?"
- "Generate a professional pentest report from these findings"
- "How do I exfiltrate data via DNS tunneling during a red team operation?"

## Legal

These skills are intended for authorized engagements only. Each skill includes scope-check guidance. Unauthorized use is illegal.
