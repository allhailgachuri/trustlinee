# Trustline Insight

TRUSTLINE — COMPLETE FRONTEND PRODUCT BUILD SPECIFICATION

ROLE

Act as a senior product designer, UX architect, fintech product architect, credit-risk analyst, and senior React/TypeScript engineer.

Build the complete frontend application for a sophisticated lender-facing credit-risk intelligence platform called:

TRUSTLINE

Alternative-Data Credit Risk Intelligence Platform

Trustline estimates borrower probability of default using financial, transaction, repayment and behavioural signals and transforms those predictions into understandable risk scores, risk bands, explanations and lender decision-support intelligence.

The application is initially an academic/demo system using synthetic and/or public benchmark data.

Do NOT claim connection to real Kenyan lenders, banks, M-Pesa, Safaricom, Tala, Branch, CRBs, or real customer financial records.

The product must look like a serious fintech credit-risk platform rather than a university project.

1. PRODUCT PHILOSOPHY

Trustline exists to create a stronger line of evidence between:

BORROWER BEHAVIOUR

and

LENDER RISK DECISION

The core workflow is:

Borrower Data
→ Alternative Data
→ Feature Engineering
→ Risk Model
→ Probability of Default
→ Risk Score
→ Risk Band
→ Explainability
→ Lender Decision Support
→ Monitoring
→ Portfolio Intelligence

The interface must communicate:

trust

financial intelligence

responsible lending

transparency

analytical rigor

explainability

risk awareness

human decision-making

Do not portray the model as an unquestionable authority.

Use language such as:

"Risk assessment"

"Decision support"

"Probability of default"

"Model recommendation"

"Risk signals"

"Human review"

2. TECHNOLOGY

Build using:

React
Vite
TypeScript
Tailwind CSS
React Router
Recharts
Lucide React
Framer Motion where useful

Use reusable components.

Use a clean service/API abstraction layer.

Prepare the frontend for future FastAPI integration.

3. BRAND

Product name:

TRUSTLINE

Primary descriptor:

Alternative-Data Credit Risk Intelligence

Possible tagline:

"Make risk measurable. Make decisions clearer."

Secondary:

"See the risk behind the application."

Use a premium financial-infrastructure visual language.

Avoid:

crypto aesthetics

excessive neon

generic banking stock imagery

cartoon graphics

excessive glassmorphism

childish illustrations

generic AI robots

Use:

deep navy/charcoal

white/soft gray

restrained blue

muted green

amber

orange

red for severe risk

Risk colors must be semantic.

4. PUBLIC LANDING PAGE

Route:

/

Create a premium landing page explaining Trustline.

Hero:

"Make risk measurable. Make lending decisions clearer."

Supporting copy:

"Trustline combines repayment behaviour, transaction patterns and borrower information to estimate probability of default and provide explainable credit-risk intelligence for digital lenders."

CTA:

"Launch Demo"

Secondary:

"Explore Trustline"

5. LANDING SECTIONS

Create:

The Credit Risk Problem

Explain thin-file lending and limited risk signals.

The Trustline Approach

Show:

Borrower Data
+
Alternative Data
↓
Feature Engineering
↓
Risk Model
↓
Probability of Default
↓
Risk Band
↓
Explainable Decision Support

Alternative Data

Explain:

Repayment consistency
Transaction frequency
Transaction volatility
Utilisation ratio
Account tenure
Days-past-due history

Clearly identify these as synthetic/demo signals when appropriate.

Explainable Risk

Show an example:

Probability of Default: 8.3%

Risk Band: Low

Top contributing signals:

Strong repayment consistency
Moderate utilisation
Stable transaction behaviour
Longer account tenure

Responsible Lending

Explain that the model supports human decisions and does not automatically determine a person's worthiness.

Model Intelligence

Show:

Logistic Regression baseline
XGBoost primary model
Calibration
AUC
KS
Precision
Recall
SHAP explanations

Final CTA

"Explore Trustline"

6. PUBLIC NAVIGATION

Navbar:

TRUSTLINE

Product
How It Works
Alternative Data
Explainability
About

[ Launch Demo ]

[ Sign In ]

Responsive mobile navigation required.

7. AUTHENTICATION

Routes:

/auth/login
/auth/signup
/auth/demo
/auth/forgot-password

Login:

Email
Password
Remember me
Forgot password
Sign In
Demo Access

Signup:

Full Name
Email
Organization
Role
Password
Confirm Password

Demo:

Clearly label:

DEMO ENVIRONMENT

Use fictional/demo credentials only.

Do not expose real credentials.

8. APPLICATION SHELL

Authenticated pages must share one application shell.

Desktop:

Sidebar
Topbar
Main content

Topbar:

Page title
Global search
Notifications
System status
User profile

9. SIDEBAR

TRUSTLINE

OVERVIEW

Dashboard

UNDERWRITING

Applications
Risk Assessment
Borrowers

PORTFOLIO

Portfolio
Analytics
Cohorts

INTELLIGENCE

Model Intelligence
Reports

SYSTEM

Settings

ADMINISTRATION

Admin Console

Admin navigation only appears for administrators.

10. GLOBAL SEARCH

Search:

Application ID
Borrower
Loan ID
Account ID

Results grouped by:

Applications
Borrowers
Loans

Clicking a result navigates to the correct detail page.

11. SYSTEM STATUS

Display:

System Operational

Expandable status:

API
Database
Risk Engine
Model
Reporting

Use demo/mock health data until backend integration.

12. DASHBOARD

Route:

/app/dashboard

Title:

"Credit Risk Overview"

Subtitle:

"Monitor applications, borrower risk and portfolio exposure."

Time filters:

24 Hours
7 Days
30 Days
90 Days

13. DASHBOARD KPI CARDS

Show:

Total Applications
Approved Applications
Pending Applications
Average Probability of Default
High-Risk Borrowers
Portfolio Exposure
Default Rate
Approval Rate

Include trends.

Clearly label simulated/demo metrics.

14. DASHBOARD CHARTS

Create:

Risk Band Distribution

Default Rate Over Time

Applications Over Time

Approval vs Rejection

Probability-of-Default Distribution

Portfolio Exposure by Risk Band

Use Recharts.

Include:

tooltips
legends
loading states
empty states

15. HIGH-RISK APPLICATIONS

Table:

Application ID
Borrower
Loan Amount
Probability of Default
Risk Score
Risk Band
Decision
Date

Clicking a row opens the application.

16. APPLICATIONS

Route:

/app/applications

Create a professional underwriting table.

Columns:

Application ID
Borrower
Loan Amount
Tenure
Probability of Default
Risk Score
Risk Band
Decision
Created

Filters:

Risk band
Decision
Loan amount
Date
Probability of default

Search.

Sort.

Pagination.

Export.

17. APPLICATION DETAIL

Route:

/app/applications/:id

This is a major Trustline workflow.

Header:

Application ID

Borrower

Loan amount

Risk band

Risk score

Probability of default

Decision

Actions:

Approve
Reject
Refer for Review

For demo purposes these actions update local mock state.

18. BORROWER PROFILE

Show:

Personal/organization information

Financial profile

Loan request

Alternative-data summary

Repayment behaviour

Transaction behaviour

Account history

Previous loans

19. RISK ASSESSMENT

Route:

/app/risk-assessment

Create a dedicated assessment form.

Sections:

Borrower Information

Age
Income
Employment status
Dependants
Residence type

Loan Information

Loan amount
Loan tenure
Loan purpose

Transaction Behaviour

Transaction frequency
Average monthly inflow
Transaction volatility
Average balance
Utilisation ratio

Repayment Behaviour

Repayment consistency
Previous loans
Days past due
Previous defaults

Account Information

Account tenure
Number of active accounts

Button:

"Assess Risk"

20. RISK RESULT

After assessment display:

Probability of Default

Risk Score

Risk Band

Recommendation

Example:

Probability of Default
8.3%

Risk Score
817

Risk Band
LOW RISK

Recommendation
"Suitable for standard review"

Do not present this as an automatic approval.

Use:

"Model recommendation"

21. RISK SCORE VISUALIZATION

Create a large circular or horizontal risk visualization.

Show:

Low
Medium
High

with the current borrower clearly positioned.

Use a tooltip explaining what the score means.

22. WHY THIS SCORE?

Create an explainability section.

Title:

"Why Trustline assessed this borrower this way"

Display:

Repayment consistency
Strong positive signal

Utilisation ratio
Moderate concern

Transaction volatility
Moderate concern

Account tenure
Positive signal

Days past due
High concern

Use horizontal contribution bars.

Frontend mock values must be explicitly treated as demonstration data until connected to real SHAP output.

23. BORROWERS

Route:

/app/borrowers

Table:

Borrower ID
Name
Risk Score
Probability of Default
Risk Band
Active Loans
Previous Defaults
Last Assessment

Filters:

Risk
Default history
Loan count

24. BORROWER DETAIL

Route:

/app/borrowers/:id

Create a complete credit-intelligence profile.

Sections:

Overview

Risk Score

Probability of Default

Risk Band

Financial Profile

Loan History

Repayment Timeline

Transaction Behaviour

Account Tenure

Utilisation

Delinquency History

Risk Signals

Model Explanation

Previous Assessments

25. REPAYMENT TIMELINE

Show:

Loan issued
Repayment due
Repayment made
Late payment
Missed payment
Loan completed

Use a visual timeline.

26. TRANSACTION BEHAVIOUR

Display:

Monthly transaction count

Average transaction amount

Transaction volatility

Average inflow

Average outflow

Utilisation

Trend charts

Clearly identify data as synthetic/demo where appropriate.

27. PORTFOLIO

Route:

/app/portfolio

This is the lender management view.

Show:

Total borrowers

Active loans

Total exposure

Outstanding balance

Average PD

Default rate

High-risk exposure

Approval rate

28. PORTFOLIO RISK DISTRIBUTION

Show:

Low Risk

Medium Risk

High Risk

Use both:

count

and

monetary exposure

This distinction is important.

A small number of high-risk borrowers with very large loans can create significant exposure.

29. PORTFOLIO ANALYTICS

Include:

Default trends

Risk trends

Approval trends

Exposure trends

Loan size distribution

Default by loan purpose

Default by risk band

Default by borrower cohort

30. ANALYTICS

Route:

/app/analytics

Create an advanced analytics workspace.

Sections:

Risk Analytics

Default Analytics

Borrower Behaviour

Loan Analytics

Repayment Analytics

Alternative Data Analytics

Charts:

Probability-of-default distribution

Default rate by utilisation

Default rate by repayment consistency

Default rate by transaction volatility

Default rate by account tenure

Default rate by loan amount

31. COHORT ANALYSIS

Route:

/app/cohorts

Allow selection of:

Quarter
Month
Borrower segment
Loan purpose
Risk band

Compare:

Default rate
Repayment rate
Average PD
Average loan size
Approval rate

Create cohort comparison charts.

32. MODEL INTELLIGENCE

Route:

/app/model-intelligence

Header:

"Model Intelligence"

Show:

Current Model

Model Version

Training Date

Dataset Version

Model Status

33. MODEL COMPARISON

Compare:

Logistic Regression

XGBoost

Table:

Model
AUC
KS
Precision
Recall
F1
Calibration
Interpretability

Clearly identify:

BASELINE

PRIMARY MODEL

34. MODEL PERFORMANCE

Show:

ROC Curve

Precision-Recall Curve

Calibration Plot

Confusion Matrix

Risk Band Performance

Use appropriate chart components.

Do not fabricate final model metrics.

Mock values should be explicitly labeled:

"Demo metrics"

35. FEATURE IMPORTANCE

Display:

Repayment Consistency

Utilisation Ratio

Transaction Frequency

Transaction Volatility

Account Tenure

Days Past Due

Loan Amount

Income

Allow clicking a feature to see a description.

36. MODEL EXPLAINABILITY

Show:

Global feature importance

Individual borrower explanation

Positive risk signals

Negative risk signals

Feature contributions

Use terminology compatible with future SHAP integration.

37. MODEL MONITORING

Show:

Prediction volume

Average PD

Risk distribution

Score distribution

Drift indicator

Feature availability

Last evaluation

Model status

Clearly label simulated drift metrics until connected to backend monitoring.

38. REPORTS

Route:

/app/reports

Report types:

Portfolio Risk Report

Borrower Risk Report

Model Performance Report

Default Analysis Report

Cohort Report

Each report card contains:

Title
Description
Date range
Generated date
Status

Buttons:

View

Generate

Export

39. REPORT DETAIL

Route:

/app/reports/:id

Create a professional report preview.

Sections:

Executive Summary

Portfolio Metrics

Risk Distribution

Default Trends

High-Risk Exposure

Model Performance

Key Findings

Recommendations

Footer:

"Generated using synthetic/demo data."

Prepare the frontend for future backend PDF generation.

40. SETTINGS

Route:

/app/settings

Tabs:

Profile

Organization

Risk Thresholds

Notifications

Security

Model Configuration

System

41. RISK THRESHOLD SETTINGS

Create an interface for configuring:

Low Risk threshold

Medium Risk threshold

High Risk threshold

But clearly indicate:

"Thresholds shown in demo mode. Production thresholds require validated model performance and business policy."

Do not imply these thresholds are regulatory standards.

42. ADMIN CONSOLE

Route:

/app/admin

Show:

Users

Organizations

Active Assessments

Model Status

System Health

Audit Events

43. ADMIN USERS

Route:

/app/admin/users

Columns:

Name
Email
Organization
Role
Status
Last Login

Roles:

Admin
Risk Manager
Analyst
Viewer

44. ADMIN RISK CONFIGURATION

Route:

/app/admin/risk-rules

Allow viewing:

Risk bands

Decision thresholds

Model version

Feature configuration

Do not allow dangerous configuration without confirmation dialogs.

45. AUDIT LOG

Route:

/app/admin/audit

Columns:

Timestamp
User
Action
Entity
Entity ID
Result

Examples:

Risk assessment created

Application reviewed

Decision updated

Report generated

Model version changed

Risk threshold changed

46. DEMO DATA

All initial data must be synthetic.

Use fictional borrowers.

Use fictional application IDs.

Example:

APP-2026-00184

BOR-10482

LOAN-83921

Do not use real people's names or real phone numbers.

Use KES as currency.

Example:

KES 5,000

KES 15,000

KES 45,000

KES 100,000

47. DEMO RISK SCENARIOS

Include:

Low-risk borrower

Stable income

High repayment consistency

Low utilisation

Long account tenure

Medium-risk borrower

Moderate volatility

Moderate utilisation

Some late repayments

High-risk borrower

Poor repayment consistency

High utilisation

High transaction volatility

Recent delinquency

Very high-risk borrower

Multiple adverse signals

48. MOCK API LAYER

Create:

src/api/

auth.ts

dashboard.ts

applications.ts

borrowers.ts

risk.ts

portfolio.ts

analytics.ts

model.ts

reports.ts

admin.ts

Create TypeScript interfaces for:

Borrower

Application

Loan

Repayment

TransactionBehaviour

RiskAssessment

RiskScore

RiskBand

ModelMetrics

Report

AuditEvent

49. FUTURE FASTAPI CONTRACT

Prepare frontend services for:

GET /api/v1/dashboard

GET /api/v1/applications

GET /api/v1/applications/{id}

GET /api/v1/borrowers

GET /api/v1/borrowers/{id}

POST /api/v1/risk/score

GET /api/v1/risk/{borrower_id}

GET /api/v1/portfolio

GET /api/v1/analytics

GET /api/v1/cohorts

GET /api/v1/model/metrics

GET /api/v1/model/features

GET /api/v1/reports

POST /api/v1/reports

GET /api/v1/health

POST /api/v1/applications/{id}/decision

Do not implement the FastAPI backend in this task.

50. NAVIGATION PRINCIPLE

The entire application must feel like one coherent workflow.

A lender should be able to move naturally:

Dashboard

→ Application

→ Borrower

→ Risk Assessment

→ Risk Explanation

→ Decision

→ Portfolio

→ Analytics

→ Model Intelligence

→ Report

Do not create isolated pages.

51. HUMAN-IN-THE-LOOP PRINCIPLE

Never communicate:

"Trustline decides whether this person deserves a loan."

Instead communicate:

"Trustline provides evidence-based risk intelligence to support lender review."

The final decision belongs to the lender/user.

52. ACCESSIBILITY

Implement:

Keyboard navigation

Visible focus states

Semantic HTML

ARIA labels

Accessible dialogs

Accessible forms

Readable contrast

53. RESPONSIVENESS

Support:

Desktop

Laptop

Tablet

Mobile

Desktop should prioritize lender workflows and data tables.

Mobile should use cards and horizontally scrollable tables where necessary.

54. ERROR STATES

Every important page must have:

Loading state

Empty state

Error state

Retry action

55. 404

Create a branded 404 page.

Message:

"That credit record doesn't exist."

Button:

"Return to Dashboard"

56. DEMO MODE

Show:

DEMO ENVIRONMENT

SIMULATED DATA

throughout the application.

Never imply that data represents real borrowers.

57. SECURITY

Never expose:

API secrets

Database credentials

Private keys

Real customer data

Passwords

Frontend environment variables should only contain public configuration such as:

VITE_API_URL

58. FINAL ACCEPTANCE CRITERIA

Do not consider the frontend complete until:

Landing page exists.

Product page exists.

How It Works exists.

Alternative Data page exists.

Explainability page exists.

About page exists.

Login exists.

Signup exists.

Demo login exists.

Forgot password exists.

Dashboard exists.

Applications exists.

Application detail exists.

Risk Assessment exists.

Risk Result exists.

Borrowers exists.

Borrower detail exists.

Portfolio exists.

Analytics exists.

Cohorts exists.

Model Intelligence exists.

Reports exists.

Report detail exists.

Settings exists.

Admin console exists.

Admin users exists.

Admin risk configuration exists.

Audit logs exists.

Search works.

Notifications work.

Role-based navigation exists.

Demo authentication works.

Mock API layer exists.

Loading states exist.

Error states exist.

Empty states exist.

404 exists.

Responsive design works.

No broken routes exist.

No Lorem Ipsum exists.

No production claims are made.

Demo data is clearly identified.

Components are reusable.

Frontend is structured for FastAPI integration.

59. FINAL PRODUCT EXPERIENCE

The user journey should communicate:

"I receive an application."

↓

"I examine the borrower."

↓

"I examine their financial behaviour."

↓

"Trustline estimates probability of default."

↓

"I see the risk band."

↓

"I understand why the model produced that assessment."

↓

"I review the evidence."

↓

"I make the lending decision."

↓

"I monitor the portfolio."

↓

"I evaluate whether the model is performing properly."

↓

"I generate a report."

This workflow is the heart of Trustline.

Build the entire frontend around this narrative.

Do not create a collection of unrelated dashboards.

Build one coherent credit-risk intelligence platform.

Then create a full on Readme that serves as a description of everything that you have built 
and make sure the site is fully responsive on all screens

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/de6b2a41-d0a0-4b26-b207-cc756c93569c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
