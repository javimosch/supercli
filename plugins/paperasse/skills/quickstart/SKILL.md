---
name: paperasse
description: Use this skill when the user needs help with French bureaucracy, accounting, tax, notary, audit, property management, or any French administrative paperwork.
---

# Paperasse Plugin — French Bureaucracy AI Skills

Collection of 6 AI agent skills for French bureaucracy. Each skill transforms an agent into an expert copilot for a specific French administrative profession.

## Installation

```bash
git clone https://github.com/romainsimon/paperasse.git
cd paperasse && npm install
cp company.example.json company.json
```

Then load skills:
```bash
sc skills teach paperasse:quickstart
```

Also installable via [agentskill.sh](https://agentskill.sh/skillsets/paperasse).

## Prerequisites: company.json

Before any paperwork, ensure `company.json` exists with company info (name, SIREN, VAT regime, bank accounts). If missing, the skills will prompt for setup.

## The 6 Skills

### Comptable (Expert-Comptable)
French accounting, tax, and invoicing. Handles:
- 800+ PCG account entries, VAT declarations, IS/IR
- Full annual closing in 12 steps (cut-off, amortization, provisions, IS)
- FEC (18-column export), liasse fiscale (2033/2065)
- Invoicing: mandatory mentions, e-invoicing 2026, Factur-X, PDP, e-reporting
- Bank reconciliation, balance sheet, P&L

### Notaire
French notary services:
- Frais de notaire calculation (old/new properties)
- Capital gains on real estate sales
- Successions (spouse, children,同居/PACS)
- Donations (monthly, manual, usufruct/nue-propriété)
- SCI creation (IR/IS), diagnostics, PACS

### Fiscaliste (Particuliers)
Personal taxation:
- IR: barème, quotient familial, décote, plafonnement, quotient revenus exceptionnels
- IFI: real estate threshold, deductible debt, biens professionnels
- PFU vs barème for dividends, interest, capital gains
- PEA, assurance-vie, LMNP (micro/réel), RSU, BSPCE, stock-options
- Crypto (PAMC), PER, CEHR

### Syndic de Copropriété
Condominium management:
- AG convocation, budget prévisionnel, appel de fonds, votes
- Accounting (décret 2005): accounting commitments, fund tracking
- Works: devis comparison, CEP, audit énergétique, DTG
- Supplier management, unpaid collections, syndic transition
- Multi-property dashboard

### Commissaire-aux-Comptes (CAC)
Statutory audit in 7 NEP phases:
- Mission acceptance, risk assessment,内部控制 testing
- Substantive procedures (cut-off, completeness, existence)
- FEC analysis, cross-validation balance/income/tax return
- Audit opinion (certification, qualifications, refusals)
- Report to shareholders

### Contrôleur Fiscal
DGFIP tax audit simulation on 8 axes:
- Accounting analysis, cash review, professional vs personal expenses
- International transactions, corporate benefit, tax credits
- Penalty calculation with legal basis (CGI articles)
- Amounts, interest, penalties per adjustment

## Helper Scripts

```bash
npm run calc        # Deterministic calculations (CCA, amortization, IS, VAT)
npm run fec         # Generate FEC 18-column export
npm run statements  # Generate balance sheet, P&L, trial balance
npm run pdfs        # Generate professional PDFs
npm run closing     # Run full closing workflow (FEC + statements + PDFs)
npm run facture     # Generate Factur-X invoice
npm run fetch       # Fetch Qonto + Stripe transactions
npm run fetch:qonto # Fetch Qonto only
npm run fetch:stripe # Fetch Stripe only
```

## Workflow: Zero to Annual Closing

Tell the agent: "Fais la clôture annuelle de ma société"

1. **Comptable** — Classify expenses, entries, VAT, reconciliation
2. **Comptable** — Cut-off, amortization, provisions, IS, FEC, liasse, PDFs
3. **CAC** — FEC verification, cross-validation, opinion
4. **Contrôleur Fiscal** — DGFIP simulation on 8 axes

## Integrations

- **Qonto**: Automatic bank transaction fetch
- **Stripe**: Automatic payment fetch (multi-account, Stripe Connect)
- Configure via `company.json` + API keys in `.env`

## Data Sources

- PCG and liasse fiscale nomenclature from data.gouv.fr
- BOFiP public API
- Sirene company registry
- Sources documented in `data/sources.json`

## Guardrails

- Each skill validates company info before proceeding
- Tax deadlines shown at every conversation
- Skills check data freshness (>6 months triggers online verification)
- Legal disclaimer: These skills do not replace certified professionals
