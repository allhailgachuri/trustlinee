# Trustline — Alternative-Data Credit Risk Intelligence Platform

A complete lender-facing frontend: public marketing site, demo authentication, and a full authenticated credit-risk workspace running entirely on synthetic demo data, structured so a FastAPI backend can be swapped in later.

## One stack note

This project runs on TanStack Router (file-based routing), not React Router. Everything requested works identically — routes, params, nested layouts, navigation — I'll just use `createFileRoute` instead of `<Routes>`. Recharts, Tailwind, Lucide, Framer Motion, TypeScript all as specified.

## Design language

Deep navy/charcoal surfaces, white/soft-gray content areas, restrained blue accent, semantic risk colors (green = low, amber = medium, orange = high, red = severe). Serious financial-infrastructure feel: dense data tables, tabular numerals, quiet motion. All colors defined as semantic tokens in `src/styles.css` (light + dark), never hardcoded.

## Public site

- `/` Landing — hero ("Make risk measurable. Make lending decisions clearer."), the credit-risk problem, the Trustline pipeline diagram, alternative data signals, an explainability example (PD 8.3% / Low band / top signals), responsible-lending statement, model intelligence summary, final CTA
- `/product`, `/how-it-works`, `/alternative-data`, `/explainability`, `/about`
- Responsive navbar with mobile sheet menu, Launch Demo + Sign In

## Authentication (demo only)

- `/auth/login`, `/auth/signup`, `/auth/demo`, `/auth/forgot-password`
- Demo credentials clearly labelled as fictional; session stored client-side, role selectable (Admin / Risk Manager / Analyst / Viewer) to drive role-based navigation

## Application shell

Sidebar (Overview, Underwriting, Portfolio, Intelligence, System, Administration — admin group only for admins), topbar with page title, global search (applications / borrowers / loans, grouped results, navigates to detail), notifications, expandable system status (API, Database, Risk Engine, Model, Reporting), user menu. Persistent "DEMO ENVIRONMENT · SIMULATED DATA" indicator.

## Authenticated pages

| Route | Contents |
| --- | --- |
| `/app/dashboard` | Time filters, 8 KPI cards with trends, 6 Recharts panels, high-risk applications table |
| `/app/applications` | Underwriting table: filters, search, sort, pagination, CSV export |
| `/app/applications/:id` | Header with PD/score/band/decision, borrower profile, alt-data summary, explainability, Approve / Reject / Refer actions updating local state |
| `/app/risk-assessment` | Full assessment form (borrower, loan, transaction, repayment, account sections) → result view |
| Risk result | PD, risk score, band, "Model recommendation", circular score gauge with Low/Medium/High positioning, "Why Trustline assessed this borrower this way" contribution bars |
| `/app/borrowers` | Table with risk filters |
| `/app/borrowers/:id` | Full credit profile: overview, financial profile, loan history, repayment timeline, transaction behaviour charts, tenure, utilisation, delinquency, risk signals, model explanation, previous assessments |
| `/app/portfolio` | Exposure KPIs, risk distribution by both count and monetary exposure, trend and breakdown charts |
| `/app/analytics` | Risk, default, behaviour, loan, repayment and alternative-data analytics sections |
| `/app/cohorts` | Cohort selectors and comparison charts |
| `/app/model-intelligence` | Model card, Logistic Regression (baseline) vs XGBoost (primary) comparison, ROC / PR / calibration / confusion matrix, feature importance with click-through descriptions, explainability, monitoring & drift |
| `/app/reports`, `/app/reports/:id` | Five report types; detail view with executive summary through recommendations, export hooks |
| `/app/settings` | Profile, Organization, Risk Thresholds, Notifications, Security, Model Configuration, System tabs |
| `/app/admin`, `/app/admin/users`, `/app/admin/risk-rules`, `/app/admin/audit` | Console overview, user management, risk configuration with confirmation dialogs, audit log |
| 404 | "That credit record doesn't exist." + Return to Dashboard |

Every metric surface is labelled as demo/simulated; model output is always framed as decision support, never as an automatic verdict.

## Data and API layer

`src/api/` modules (auth, dashboard, applications, borrowers, risk, portfolio, analytics, model, reports, admin) with async functions and simulated latency, backed by a synthetic dataset in `src/data/`. Shared TypeScript interfaces (Borrower, Application, Loan, Repayment, TransactionBehaviour, RiskAssessment, RiskScore, RiskBand, ModelMetrics, Report, AuditEvent). Each function maps 1:1 to its future `/api/v1/...` endpoint and reads a single `VITE_API_URL` toggle, so swapping mock for FastAPI is one change per module.

Demo data: fictional borrowers, IDs like `APP-2026-00184`, `BOR-10482`, `LOAN-83921`, KES currency, and four scripted risk scenarios (low, medium, high, very high).

## Cross-cutting

Loading skeletons, empty states, and error states with retry on every data page. Keyboard navigation, visible focus rings, semantic HTML, ARIA labels, accessible dialogs and forms. Responsive from mobile (card layouts, horizontally scrollable tables) to wide desktop. Per-route `head()` metadata.

## Build order

1. Design tokens, shared UI primitives, types, synthetic dataset, mock API layer
2. Public marketing site + auth pages
3. App shell, search, notifications, system status, role-based nav
4. Dashboard, applications, application detail
5. Risk assessment + result + explainability
6. Borrowers and borrower detail
7. Portfolio, analytics, cohorts
8. Model intelligence, reports
9. Settings, admin console, audit
10. Responsive/accessibility pass, 404, then a full `README.md` documenting the product, architecture, routes, data model, and FastAPI contract

This is a large build; I'll work through the phases in order and report progress as sections land.
