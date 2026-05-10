---
name: faker-cli
description: Use this skill when the user wants to generate fake data for testing, mockups, demos, or placeholder content — names, addresses, emails, phone numbers, lorem ipsum, company info, finance data, or randomized contextual data.
---

# Faker CLI Plugin

Generate fake contextual data from the command line. Wraps Faker.js for names, addresses, emails, lorem ipsum, and more.

## Commands

### Self
- `faker-cli self version` — Print version

### Data
- `faker-cli data generate` — Generate fake data (passthrough: `faker-cli --names findName`, `--helpers userCard`, etc.)

### Reference
- `faker-cli list locales` — List available locales

### Passthrough
- `faker-cli _ _` — Passthrough for any faker-cli command

## Usage Examples
- "Generate a fake person profile (userCard)"
- "Give me a random name and email address"
- "Generate lorem ipsum text"
- "Create mock company data"
- "Get a fake phone number"
- "Generate random UUID"

## Installation

```bash
npm install -g faker-cli
```

## Examples

```bash
# Full contextual user profile
faker-cli --helpers userCard

# Names
faker-cli --names findName
faker-cli --names firstName
faker-cli --names lastName

# Contact
faker-cli --internet email
faker-cli --internet userName
faker-cli --phone phoneNumber

# Address
faker-cli --address streetAddress
faker-cli --address city
faker-cli --address country

# Lorem ipsum
faker-cli --lorem paragraph
faker-cli --lorem sentences

# Company
faker-cli --company companyName
faker-cli --company catchPhrase

# Finance
faker-cli --finance account
faker-cli --finance bitcoinAddress

# Random
faker-cli --random uuid
faker-cli --random number

# Localized data
faker-cli --locale de --helpers userCard
faker-cli --locale fr --address city

# List locales
faker-cli --locales
```

## Key Features
- 20+ data categories (names, address, company, internet, lorem, finance, etc.)
- Localized data via `--locale`
- Full contextual profiles via `--helpers userCard`
- Random IDs, UUIDs, numbers
- Lorem ipsum text generation
- Mock company, finance, and commerce data
- Hacker-style phrases
- Image URLs
