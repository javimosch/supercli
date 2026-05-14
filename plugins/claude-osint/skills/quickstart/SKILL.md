---
name: claude-osint
description: Use this skill when the user needs OSINT reconnaissance, external attack-surface mapping, secret/credential hunting, subdomain enumeration, cloud exposure assessment, or any authorized open-source intelligence gathering.
---

# Claude-OSINT — OSINT Reconnaissance Skills

2 paired Claude skills (5,500+ lines) for external recon: **osint-methodology** (how to think) and **offensive-osint** (what to reach for). Built by ElementalSoul.

## Installation

```bash
git clone https://github.com/elementalsouls/Claude-OSINT.git
sc skills teach claude-osint:quickstart
```

## Skill 1: osint-methodology (Strategic + Procedural)
- 5-stage external recon pipeline with time-budget profiles (1h / 4h / 1d / 1w)
- Asset-graph discipline for tracking discovered relationships
- Severity/confidence/detectability rubric
- Identity-fabric mapping across platforms
- OpSec and detectability awareness
- Client deliverable templates and bug-bounty submission templates

## Skill 2: offensive-osint (Tactical Arsenal)
90+ capabilities across 12 domains:

| Domain | Key Capabilities |
|--------|-----------------|
| Asset Discovery | Subdomain source stack (crt.sh + 7 fallback), prefix sweep, Wayback CDX mining, WHOIS/RDAP |
| Identity & SSO | Microsoft Entra fingerprint, M365 deep enum, Okta, ADFS, Google Workspace, AWS account ID |
| Web Attack Surface | Swagger/OpenAPI discovery (28 paths), GraphQL introspection, .git/.env/actuator leak checks |
| Cloud & Container | S3/GCS/Azure bucket arsenal (6x15x47 combos), K8s exposure, CI/CD platform hunting |
| Secret Hunting | 48-pattern secret-regex catalog, GitHub dorks (13 templates), 9 read-only credential validators |
| Breach Intel | HudsonRock Cavalier API, breach × identity correlation |
| Vendor Fingerprinting | Citrix, F5 BIG-IP, Ivanti, PaloAlto, Cisco, VMware, Exchange OWA, KEV/CVE enrichment |
| Email Security | SPF/DMARC/DKIM/BIMI/MTA-STS audit, DMARC vendor inference, 35+ SaaS token patterns |
| Human Intel | LinkedIn employee enum, job postings tech-stack, Slack/Discord discovery |
| Supply Chain | Package-registry leak hunting, typo-squat surveillance, Postman workspace search |
| Reporting | Findings rubric, severity decision matrix (88 examples), attack-path templates (27) |
| Sector-Specific | Healthcare (DICOM/HL7/FHIR), Finance (SWIFT/FIX), ICS/SCADA (Modbus/BACnet), IoT (MQTT/CoAP) |

## Usage Prompts

- "Enumerate all subdomains for example.com using multiple sources"
- "Find exposed secrets in the GitHub repos of targetorg"
- "Map the entire attack surface for this company — domains, cloud, email, SSO"
- "Check if target.com has DMARC and how strict it is"
- "Find API endpoints and documentation for api.target.com"
- "Hunt for exposed cloud buckets belonging to this organization"

## Authorization

These skills are intended for assets you own or have written authorization to assess. Skills include soft scope-checking.
