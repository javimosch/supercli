# openscap Plugin for SuperCLI

[OpenSCAP](https://github.com/OpenSCAP/openscap) is the reference open-source
SCAP implementation. Its `oscap` CLI evaluates XCCDF benchmarks (CIS, DISA STIG,
PCI-DSS via scap-security-guide), runs OVAL vulnerability definitions, produces
ARF/HTML reports, and generates remediation scripts.

## Installation

```bash
# Debian/Ubuntu (pick the package your release provides)
sudo apt-get install -y openscap-scanner || sudo apt-get install -y openscap-utils
# Fedora/RHEL: sudo dnf install openscap-scanner
# Benchmark content: apt install ssg-debian / dnf install scap-security-guide

# Install supercli plugin
supercli plugins install ./plugins/openscap
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli openscap self version` | Show oscap version |
| `supercli openscap info inspect <file>` | Inspect a SCAP datastream |
| `supercli openscap xccdf eval` | Evaluate an XCCDF benchmark |
| `supercli openscap oval eval <file>` | Evaluate OVAL definitions |
| `supercli openscap <any>` | Passthrough to oscap CLI |

## Usage

```bash
supercli openscap info inspect /usr/share/xml/scap/ssg/content/ssg-ubuntu2204-ds.xml
supercli openscap xccdf eval --profile xccdf_org.ssgproject.content_profile_cis_level1_server \
  --report /tmp/report.html /usr/share/xml/scap/ssg/content/ssg-ubuntu2204-ds.xml
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
