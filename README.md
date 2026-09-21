# Dhaniti — Education Lending Application Intelligence Dashboard

A production-ready portfolio intelligence and application tracking platform for **Dhaniti**. Built specifically for the technical internship assignment to deliver complete end-to-end functionality within an accelerated 1-hour build timeframe.

---

## 1. Project Overview & Architecture

The application provides credit risk officers, underwriting teams, and academic partnership managers with real-time portfolio health metrics, program risk distributions, and granular loan application lifecycle tracking.

### System Architecture

```text
dhaniti-internship-project/
├── backend/                  # Independent Node.js / Express backend
│   ├── package.json          # Express, pg, dotenv, cors
│   ├── schema.sql            # Relational PostgreSQL 3NF schema with foreign keys & indexes
│   ├── scripts/
│   │   └── seed.js           # Automated ETL ingestion & data-cleaning pipeline
│   ├── src/
│   │   ├── app.js            # Express app, CORS, error handling
│   │   ├── server.js         # HTTP server entry point (Port 5000)
│   │   ├── db/
│   │   │   └── index.js      # PostgreSQL connection pool with automated fallback
│   │   ├── routes/           # RESTful API endpoints (/api/applications, /api/dashboard)
│   │   ├── controllers/      # Request handlers & response formatting
│   │   ├── services/         # Core business logic, aggregations, risk rules
│   │   └── utils/
│   │       └── dataCleaner.js# Normalization (trimming, typo correction, NULL handling)
│   ├── .env.example
│   └── .env
│
├── frontend/                 # Independent React / Vite frontend
│   ├── package.json          # React 18, Vite, Tailwind CSS, Recharts, Lucide Icons
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js        # Centralized HTTP client (reads VITE_API_BASE_URL)
│   │   ├── components/       # UI Components (KPIs, Charts, Table, Modals, Filters)
│   │   └── pages/
│   │       └── Dashboard.jsx # Main interactive intelligence dashboard
│   ├── .env.example
│   └── .env
│
├── data/                     # Authoritative CSV datasets
│   ├── education_loan_applications.csv
│   ├── institutions.csv
│   ├── courses.csv
│   ├── statuses.csv
│   └── data_dictionary.csv
│
├── README.md                 # Complete technical documentation
└── AI_USAGE.md               # Transparent AI engineering disclosure
```

---

## 2. Technology Stack

* **Frontend**: React 18 (JavaScript / JSX), Tailwind CSS, Vite, Recharts, Lucide Icons
* **Backend**: Node.js, Express.js (JavaScript / CommonJS)
* **Database**: PostgreSQL (Relational schema with Foreign Keys and B-Tree indexes)
* **HTTP / Data Fetching**: Native `fetch` with centralized API abstraction layer

---

## 3. Setup & Execution Instructions

### Prerequisites
* Node.js v18+ installed
* PostgreSQL database instance running (local or cloud-hosted)

### Step 1: Database Setup & Seeding

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/dhaniti_db
   FRONTEND_URL=http://localhost:5173
   ```

3. Seed the database from the CSV files:
   ```bash
   npm run db:seed
   ```
   *This executes `schema.sql`, parses all 5 CSVs, cleans quality defects, and inserts records into PostgreSQL.*

4. Start the backend server:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

### Step 2: Frontend Setup

1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   # Dashboard accessible at http://localhost:5173
   ```

---

## 4. API Endpoints Specification

### Dashboard Analytics
* `GET /api/dashboard/summary` — Key KPIs (Total Volume, Approved, Under Review, Rejected, Loan Amount, Approval Rate).
* `GET /api/dashboard/status` — Status breakdown with application counts, total loan amount, and percentages.
* `GET /api/dashboard/courses` — Course demand across degrees with applicant volume and average ticket size.
* `GET /api/dashboard/institutions` — Institution application volume and approval conversion rates.
* `GET /api/dashboard/credit-scores` — Credit score bracket distribution (<600, 600-649, 650-699, 700-749, 750+, Missing).
* `GET /api/dashboard/insights` — 5 calculated real portfolio insights with exact calculation logic.
* `GET /api/dashboard/data-quality` — 5 documented data quality issues and resolution methods.

### Applications Management
* `GET /api/applications` — List applications with query parameters: `search`, `status`, `course`, `institution`, `sortBy`, `order`.
* `GET /api/applications/:id` — View full joined application profile including academic and financial data.
* `POST /api/applications` — Create a new loan application record with validation.
* `PATCH /api/applications/:id/status` — Update application status (`Submitted`, `Under Review`, `Approved`, `Rejected`).
* `GET /api/applications/meta/filters` — Master filter dropdown options.

---

## 5. Data Quality Issues Identified & Handled

The dataset contained deliberate data quality challenges. The cleaning pipeline (`backend/src/utils/dataCleaner.js`) handled them as follows:

| Issue ID | Anomaly Description | Affected Record(s) | Resolution Method | Engineering Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **DQ-001** | Missing Credit Score | `EDU1092` (Lakshmi Rao) | Preserved as `NULL` / `N/A` in database & UI | Imputing with 0 falsely labels the borrower delinquent; imputing with mean fabricates history. Preserving NULL ensures underwriters conduct manual bureau checks. |
| **DQ-002** | State Name Typo | `EDU1134` (`"Telengana"`) | Normalized to canonical `"Telangana"` | Eliminates duplicate geographic tags, enabling clean analytics and accurate regional filtering. |
| **DQ-003** | Trailing Whitespace | `EDU1065` (`"MBA "`), `EDU1121` (`"Website "`) | Applied `.trim()` during data ingestion | Prevents exact SQL string matching failures (`WHERE course_name = 'MBA'`) and split legend categories. |
| **DQ-004** | Master Data Inconsistencies | `EDU1032` (Abbreviated institute name), `EDU1065` (ID vs course text) | Relational Foreign Key binding via `institution_id` and `course_id` | Enforces relational integrity where the master entity tables serve as the single source of truth. |
| **DQ-005** | Over-Financing Anomaly | `EDU1143` (Loan ₹5.40L vs Fee ₹4.40L) | Retained as submitted; flagged in UI via Attention Level | Lenders must not modify borrower submissions; flagging highlights excessive non-tuition living expense requests. |

---

## 6. 5 Calculated Business Insights

1. **High In-Progress Funnel (47.3% Pipeline)**
   * *Finding*: 71 of 150 applications are currently non-terminal (55 Under Review, 16 Submitted).
   * *Calculation*: `(55 + 16) / 150 = 47.3%`.
   * *Business Impact*: Nearly half of portfolio capital is stalled in evaluation. Streamlining turnaround times will accelerate loan disbursement velocity.
2. **Disproportionate Capital Exposure in Medical Degrees (3.7x Higher)**
   * *Finding*: MBBS applications average ₹12,02,743 per applicant, compared to ₹3,27,998 for undergraduate management (BBA).
   * *Calculation*: Arithmetic mean of `loan_amount_requested_inr` grouped by `course_id`.
   * *Business Impact*: High ticket sizes and multi-year completion timelines require co-borrower guarantees and specialized tranche-disbursement structures.
3. **Credit Score Divergence (+59 Point Gap)**
   * *Finding*: Approved applicants average a 715 credit score, whereas rejected applicants average 656.
   * *Calculation*: Average `credit_score` grouped by status (excluding null values).
   * *Business Impact*: Validates underwriting alignment, indicating applicants below 650 should be prompted for co-signers prior to formal submission.
4. **Partner Channel Concentration (66.7% Referral Origination)**
   * *Finding*: Counsellor (37), Institution Referral (34), and Partner Referral (29) generate 100 out of 150 applications.
   * *Calculation*: Sum of referral channels divided by 150.
   * *Business Impact*: Dhaniti is predominantly partner-driven. Direct-to-consumer digital channels (16.7%) represent an untapped acquisition expansion opportunity.
5. **Severe Debt-to-Income Outliers (FOIR > 100%)**
   * *Finding*: Applicants like `EDU1019` (₹50k debt on ₹45k income) and `EDU1008` (₹7.6k debt on ₹0 income) present household debt exceeding stated earnings.
   * *Calculation*: Filter where `existing_monthly_obligations_inr >= parent_monthly_income_inr`.
   * *Business Impact*: Indicates immediate default risk that should trigger automated pre-underwriting screening before manual assessment.

---

## 7. Illustrative Attention Level (Rule-Based Analytics)

To assist loan officers in prioritizing files, applications feature a rule-based **Attention Level**:
* **High Attention**: Credit score < 600, OR existing monthly obligations exceed monthly income, OR loan requested exceeds course tuition fee.
* **Review Required**: Credit score between 600–680, OR Fixed Obligation to Income Ratio (FOIR) > 40%, OR Missing credit score (requires manual bureau fetch).
* **Low Attention**: Meets standard benchmark criteria.

*Disclaimer: This is an illustrative portfolio analytics feature and does not constitute formal underwriting credit policy.*

---

## 8. Trade-Offs & Future Improvements

### Trade-Offs Made (1-Hour Time Limit)
* **Zero Authentication**: Omitted login/RBAC to deliver complete core features within the 1-hour constraint.
* **Synchronous Aggregations**: Calculated analytics via direct database/service queries rather than maintaining materialized views or background cron jobs.
* **In-Memory Graceful Fallback**: Added in-memory dataset handling so reviewers can run and test the frontend/backend even without a live local PostgreSQL instance configured.

### Future Roadmap
1. Role-based access control (Credit Officer vs. Institution Partner vs. Admin).
2. Automated PDF document generation for loan sanction letters.
3. Webhook integration with credit bureaus (CIBIL/Experian) to automatically resolve missing scores.
4. Automated EMI repayment simulation calculator based on loan tenor.
