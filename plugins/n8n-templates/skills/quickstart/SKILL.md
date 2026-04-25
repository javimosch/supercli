# n8n Templates Plugin

## Overview
The n8n-templates plugin provides access to 280+ free n8n automation templates from the [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates) repository.

## What is n8n?
n8n is an open-source workflow automation platform that lets you connect anything to everything. Unlike closed-source alternatives, n8n gives you full control over your data and infrastructure.

**Key advantages:**
- Open-source and self-hostable
- 400+ built-in integrations
- Visual workflow editor (no coding required)
- AI-native capabilities (OpenAI, Claude, Gemini, LangChain)
- Free to start with generous free tier

## Available Templates
The repository includes templates across 18+ categories:
- Gmail & Email Automation
- Telegram bots
- Google Drive & Google Sheets
- WordPress
- PDF & Document Processing
- Discord
- Database & Storage
- DevOps / Server Automation
- Airtable
- Notion
- Slack
- OpenAI & LLMs
- WhatsApp
- Social Media (Instagram, Twitter/X, LinkedIn)
- Forms & Surveys
- AI Research, RAG, and Data Analysis

## Quick Start

### 1. Clone the repository
```bash
sc n8n-templates repo clone
```

### 2. Browse templates
```bash
sc n8n-templates repo browse
```

### 3. Sign up for n8n
```bash
sc n8n-templates n8n signup
```

### 4. Import a template
1. Download any `.json` template file from the cloned repository
2. In n8n, go to **Workflows → Import from File**
3. Select the JSON file
4. Configure credentials for connected services
5. Activate the workflow

## Template Categories
- **Email automation**: Gmail auto-replies, email parsing, newsletter workflows
- **AI chatbots**: RAG pipelines, OpenAI integrations, Claude workflows
- **Social media**: Auto-posting, content scheduling, engagement tracking
- **DevOps**: CI/CD automation, server monitoring, deployment workflows
- **Document processing**: PDF parsing, OCR, file conversions
- **Data integration**: Database sync, API connectors, ETL pipelines

## Requirements
- GitHub CLI (`gh`) installed and authenticated
- n8n account (free or self-hosted)

## Useful Commands
- `sc n8n-templates repo clone` - Clone the templates repository
- `sc n8n-templates repo browse` - Open repository in browser
- `sc n8n-templates templates list` - View available categories
- `sc n8n-templates n8n signup` - Open n8n signup page

## Repository Stats
- 280+ automation templates
- 19,000+ GitHub stars
- Supports: Gmail, Telegram, Slack, Discord, WhatsApp, Google Drive, Notion, OpenAI, and more
- AI integrations: GPT-4, Claude, Gemini, DeepSeek, Mistral, LangChain, Perplexity, Hugging Face
