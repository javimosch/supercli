---
name: openscap
description: Use this skill when the user wants to run SCAP compliance benchmarks, OVAL vulnerability checks, or security audits with oscap.
---

# openscap Plugin

openscap is the reference open-source SCAP (Security Content Automation Protocol) implementation. Its `oscap` CLI evaluates XCCDF benchmarks (CIS, DISA STIG, PCI-DSS — via scap-security-guide content), runs OVAL vulnerability definitions, produces ARF/HTML reports, and generates remediation scripts.

## Commands

### Audit
- `openscap info inspect <file>` — Inspect a datastream/benchmark (profiles, checks)
- `openscap xccdf eval` — Evaluate an XCCDF benchmark against the system (`--profile`, `--results`, `--report`, `--remediate`)
- `openscap oval eval <file>` — Evaluate an OVAL definitions file
- `openscap _ _` — Passthrough (xccdf generate fix, ds rds-split, cvss, validate)

## Usage Examples

- "Audit this server against the CIS benchmark"
- "Check which SCAP profiles are available in this datastream"
- "Generate a remediation script for failed checks"

## Installation

```bash
sudo apt-get install -y openscap-scanner   # Debian/Ubuntu (or openscap-utils)
# Fedora/RHEL: sudo dnf install openscap-scanner
# Benchmark content: apt install ssg-debian  /  dnf install scap-security-guide
```

## Examples

```bash
# List profiles bundled in the SSG datastream
oscap info /usr/share/xml/scap/ssg/content/ssg-ubuntu2204-ds.xml

# Evaluate a CIS profile and write results + HTML report
sudo oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_cis_level1_server \
  --results /tmp/results.xml --report /tmp/report.html \
  /usr/share/xml/scap/ssg/content/ssg-ubuntu2204-ds.xml

# Scan the host for OVAL-listed vulnerabilities
oscap oval eval --results /tmp/oval-results.xml com.redhat.rhsa-all.xml

# Generate a bash fix script for failed rules
oscap xccdf generate fix --fix-type bash /tmp/results.xml > /tmp/fix.sh
```

## Key Features

- NIST-certified SCAP 1.3 scanner; OVAL and XCCDF engines
- Tailoring support to customize benchmark profiles
- Remediation output: bash, Ansible, Puppet, Kubernetes manifests
- Requires benchmark content (SCAP Security Guide) and usually root for system probes
