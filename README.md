# Trustline Insight — Alternative-Data Credit Risk Intelligence

[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.170-FF4154?style=flat)](https://tanstack.com/router)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **"Make risk measurable. Make decisions clearer."**  
> Trustline combines mobile repayment behaviour, cash-flow patterns, and borrower telemetry to estimate probability of default (PD) and provide explainable credit-risk intelligence for digital lenders across Kenya and East Africa.

---

## 🌟 Executive Overview

In emerging economies, millions of micro-entrepreneurs, informal market traders, and smallholder farmers operate without multi-year records in traditional credit reference bureaus (CRBs). When seeking growth capital or working liquidity, these creditworthy "thin-file" borrowers are often rejected due to information asymmetry.

**Trustline** bridges this credit visibility gap. By ingesting verified digital wallet statements, cash-flow velocity, repayment consistency, and transactional volatility, Trustline computes transparent credit scores (300–900 scale), calibrated default probabilities, and directional **SHAP feature attribution waterfalls**—transforming automated machine learning into trusted human-in-the-loop underwriting decisions.

---

## 🏗️ Technical Architecture

Trustline is engineered as a high-performance, single-page application (SPA) designed to integrate seamlessly with modern cloud edge runtimes (Vercel, Netlify) and a high-throughput Python FastAPI backend:

- **Frontend Core**: React 19 + TypeScript + Vite 8
- **Routing**: `@tanstack/react-router` with fully typed route tree generation
- **State & Caching**: `@tanstack/react-query`
- **Styling & Tokens**: Tailwind CSS v4 + Semantic Financial Risk Design Tokens (`--risk-low`, `--risk-medium`, `--risk-high`, `--risk-severe`)
- **Charts & Visualizations**: Recharts + Framer Motion
- **Icons & Primitives**: Lucide React + Radix UI Primitives + Sonner Toast Engine
- **Data & Mock Layer**: Synthetic seeded dataset in Kenyan Shillings (KES) representing 52 borrowers across 4 risk profiles.

```
┌─────────────────────────────────────────────────────────────┐
│                      Trustline Frontend                     │
│    (Landing • Sandbox • Underwriting • Portfolio • Admin)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Typed Service Client
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service / API Layer                      │
│     (src/api/ — Auth, Applications, Risk, Model, Reports)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Direct Swap Ready via VITE_API_URL)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Future FastAPI Backend                     │
│    (POST /api/v1/risk/score • GET /api/v1/portfolio)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Platform Capabilities

### 1. Evaluation Sandbox (1-Click Instant Access)
- **Instant Supervisor Access**: Preloaded profile for **Dr. Sarah Kimani (Head of Credit Risk / Super Admin)**.
- **Dynamic Persona Switcher**: Seamlessly evaluate the platform as an **Admin**, **Risk Manager**, **Credit Analyst**, or **Executive Viewer**.
- **Seeded Dataset**: 52 fictional borrowers, hundreds of loan facilities, 12-month mobile cashflow profiles, repayment timelines, and audit logs in KES.

### 2. Underwriting & Real-Time Decision Support
- **Interactive Scoring Simulator (`/app/risk-assessment`)**: Adjust borrower income, loan request, cashflow utilisation, transaction volatility, and repayment consistency to observe real-time score and SHAP feature shifts.
- **Underwriting Queue (`/app/applications`)**: Multi-column sorting, filtering by risk band, decision status, and one-click CSV export.
- **Application Dossier (`/app/applications/$id`)**: Complete 360° underwriting view with semi-circular score gauge, SHAP waterfall, cashflow metrics, and one-click **Approve / Refer / Reject** decision modals with audit logging.

### 3. Borrower 360° Intelligence (`/app/borrowers/$id`)
- Comprehensive demographic, financial, and alternative data breakdown.
- **12-Month Cashflow Graph**: Visual monthly inflow vs outflow comparison.
- **Visual Repayment Timeline**: Event-level breakdown of disbursed, paid, late, and missed installments.

### 4. Portfolio Management & Econometric Analytics (`/app/portfolio`, `/app/analytics`, `/app/cohorts`)
- **Count vs Capital Exposure**: Dual-lens risk distribution breakdown comparing borrower population against monetary capital at risk.
- **Non-Linear Risk Curves**: Default rates mapped against cash flow utilisation, transaction volatility, account tenure, and loan sizes.
- **Cohort Vintage Loss Curves**: Vintage analysis comparing default compliance across quarters, borrower segments, and borrowing purposes.

### 5. Model Intelligence & SHAP Governance (`/app/model-intelligence`)
- **Scorecard Benchmarking**: Side-by-side comparison between primary **XGBoost v1.4.0** (AUC: 0.884, KS: 54.2) and baseline **Logistic Regression** (AUC: 0.768, KS: 38.6).
- **Statistical Curves**: Interactive ROC Curve, Calibration Reliability Plot, Precision-Recall Curve, and Confusion Matrix.
- **Covariate Drift Monitoring (PSI)**: Live Population Stability Index tracking feature drift across mobile-money signals.

### 6. Institutional Reporting & Administration (`/app/reports`, `/app/admin`)
- **Executive Digests (`/app/reports/$id`)**: Automated executive summaries, risk recommendations, and printer-friendly PDF export format.
- **User Permission Management (`/app/admin/users`)**: Role-based access control (RBAC) and underwriter invitations.
- **Policy Rules Configuration (`/app/admin/risk-rules`)**: Configurable auto-approval thresholds and single-facility exposure limits.
- **Immutable Compliance Audit Log (`/app/admin/audit`)**: Complete searchable log of every underwriting action.

---

## 🗺️ Route Sitemap

| Route | Description |
| :--- | :--- |
| `/` | Public Landing Page with interactive mini scoring simulator |
| `/product` | Product suite overview (Underwriting, Portfolio, Governance) |
| `/how-it-works` | Step-by-step 5-stage risk scoring methodology |
| `/alternative-data` | Interactive alternative data signal explorer |
| `/explainability` | SHAP feature attribution and responsible AI showcase |
| `/about` | Mission, financial inclusion context, and governance |
| `/auth/login` | 1-Click Evaluation Sandbox login & institutional sign-in |
| `/auth/signup` | Institutional Sandbox onboarding form |
| `/auth/demo` | Test personas catalog & quick sandbox launcher |
| `/auth/forgot-password` | Password recovery verification flow |
| `/app/dashboard` | Executive Risk Overview dashboard (KPIs, Trends, Priority Queue) |
| `/app/applications` | Underwriting application registry & multi-column filters |
| `/app/applications/$id` | Full application detail, SHAP breakdown & decision actions |
| `/app/risk-assessment` | Interactive credit risk scoring simulator & calculator |
| `/app/borrowers` | Borrower directory with demographic & risk metrics |
| `/app/borrowers/$id` | Borrower 360° credit dossier & 12-month cash flow chart |
| `/app/portfolio` | Lender portfolio exposure & risk distribution analysis |
| `/app/analytics` | Advanced non-linear risk diagnostics & telemetry quality |
| `/app/cohorts` | Cohort vintage loss curves & comparison engine |
| `/app/model-intelligence`| XGBoost vs Scorecard benchmarks, ROC curves, PSI drift |
| `/app/reports` | Institutional reports library & report generation modal |
| `/app/reports/$id` | Full executive report preview with print/PDF styling |
| `/app/settings` | Risk appetite threshold sliders, notifications & API keys |
| `/app/admin` | System Administration hub & microservice health status |
| `/app/admin/users` | User management & role assignment |
| `/app/admin/risk-rules` | Automated underwriting boundaries & approval thresholds |
| `/app/admin/audit` | Immutable compliance audit stream |

---

## 📦 Deployment on Vercel & Netlify

Trustline follows the zero-config client SPA architecture:

### Vercel Deployment
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: `Vite`
- Deep linking is handled automatically by the included `vercel.json` rewrite:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### Netlify Deployment
- Handled automatically via `netlify.toml`:
  ```toml
  [build]
    publish = "dist"
    command = "npm run build"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

---

## 💻 Local Development

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/BuiltbyRushion/trustline-insight.git
cd trustline-insight

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build static production bundle
npm run build

# 5. Preview production build locally
npm run preview
```

The application runs locally at `http://localhost:8080`.

---

## 🛡️ Responsible Lending & Compliance Notice

> **Important**: Trustline Insight is an academic and demonstration software platform utilizing synthetic data in Kenyan Shillings (KES). No real individual financial records, credit bureau histories, or bank accounts are accessed or represented. Machine learning model outputs are designed as decision support for human underwriters and should never be utilized as fully autonomous determinants of credit worthiness without verified regulatory compliance and human review.

---

*© 2026 BuiltbyRushion Engineering. Nairobi, Kenya.*
