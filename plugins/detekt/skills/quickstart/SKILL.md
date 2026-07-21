---
name: detekt
description: Use this skill when the user wants static analysis for Kotlin code — detect code smells, complexity, style violations, and generate reports for CI pipelines.
---

# detekt Plugin

Static analysis for Kotlin and Gradle projects. Enforces style rules, flags complexity and smells, and integrates with CI via SARIF/XML/TXT reports.

## Installation

```bash
brew install detekt
# or via Gradle plugin in build.gradle.kts:
# plugins { id("io.gitlab.arturbosch.detekt") version "1.23.7" }
```

Download CLI jars from [GitHub Releases](https://github.com/detekt/detekt/releases).

## Basic Usage

```bash
# Analyze a Kotlin project directory
detekt --input src/

# Use a custom ruleset config
detekt --config detekt.yml --input .

# Generate a report for CI
detekt --input src/ --report xml:build/detekt.xml

# Auto-correct fixable issues
detekt --input src/ --auto-correct
```

## Common Patterns

```bash
# Baseline existing issues (ignore legacy debt)
detekt --create-baseline --baseline detekt-baseline.xml --input src/
detekt --baseline detekt-baseline.xml --input src/

# Fail build on findings
detekt --input src/ --fail-on-max-issues 0

# Gradle wrapper (typical in Kotlin repos)
./gradlew detekt
```

## Usage Examples

- "Run detekt on this Kotlin module"
- "Generate an XML report for CI"
- "Check for code smells before opening a PR"

## SuperCLI

```bash
sc detekt _ _ --input src/
sc detekt _ _ --config detekt.yml --input .
sc plugins learn detekt
```
