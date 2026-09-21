# Dhaniti — Education Lending Application Intelligence Dashboard

An end-to-end portfolio intelligence and loan application tracking dashboard designed for education lending operations.

The application provides portfolio-level analytics, application lifecycle management, data-quality handling, and rule-based attention indicators for loan applications.

---

## 1. Project Overview

The Dhaniti dashboard is designed to help lending and underwriting teams monitor education-loan applications through:

* Portfolio-level KPIs
* Application status distribution
* Course and institution analytics
* Credit-score distribution
* Application search, filtering, and sorting
* Individual application details
* Application status updates
* Data-quality monitoring
* Rule-based attention indicators
* Calculated business insights

The project uses a React frontend, Node.js/Express backend, and PostgreSQL database, with the provided CSV files serving as the initial source data.

---

## 2. Project Structure

```text
dhaniti-internship-project/
│
├── backend/
│   ├── package.json
│   ├── schema.sql
│   ├── scripts/
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   │
│   │   ├── db/
│   │   │   └── index.js
│   │   │
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   │       └── dataCleaner.js
│   │
│   └── .env.example
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   │
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── components/
│   │   └── pages/
│   │       └── Dashboard.jsx
│   │
│   └── .env.example
│
├── data/
│   ├── education_loan_applications.csv
│   ├── institutions.csv
│   ├── courses.csv
│   ├── statuses.csv
│   └── data_dictionary.csv
│
├── README.md
└── AI_USAGE.md
```

---

## 3. Technology Stack

### Frontend

* React 18
* JavaScript / JSX
* Vite
* Tailwind CSS
* Recharts
* Lucide Icons
* Native Fetch API

### Backend

* Node.js
* Express.js
* JavaScript / CommonJS
* REST APIs

### Database

* PostgreSQL
* Relational schema
* Foreign keys
* B-tree indexes
* SQL aggregations and joins

### Development & Deployment Tools

* Git / GitHub
* Postman
* Vercel
* Render

---

## 4. Application Architecture

The application follows a separated frontend/backend architecture.

```text
                ┌─────────────────────┐
                │     React / Vite    │
                │      Frontend       │
                └──────────┬──────────┘
                           │
                           │ REST API
                           ▼
                ┌─────────────────────┐
                │   Node.js / Express │
                │       Backend       │
                └──────────┬──────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
     ┌───────────────┐          ┌────────────────┐
     │   Services    │          │   Controllers  │
     │ Business Logic│          │ Request/Reply  │
     └───────┬───────┘          └────────────────┘
             │
             ▼
     ┌─────────────────┐
     │   PostgreSQL    │
     │    Database     │
     └─────────────────┘
             ▲
             │
     ┌─────────────────┐
     │   CSV Dataset   │
     │ Seed / Cleaning │
     └─────────────────┘
```

---

## 5. Database Design

The PostgreSQL database separates master data from transactional application data.

The main entities include:

* Loan applications
* Institutions
* Courses
* Application statuses

Relationships are maintained through foreign keys such as:

```text
Applications
    │
    ├── institution_id → Institutions
    │
    ├── course_id → Courses
    │
    └── status_id → Statuses
```

Indexes are used on frequently queried fields to improve filtering and lookup performance.

The database schema is defined in:

```text
backend/schema.sql
```

---

## 6. Setup & Installation

### Prerequisites

Install the following before running the project:

* Node.js 18+
* PostgreSQL
* npm

---

### Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd dhaniti-internship-project
```

---

### Step 2 — Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/dhaniti_db
FRONTEND_URL=http://localhost:5173
```

Replace the PostgreSQL username, password, host, port, and database name with your local configuration.

---

### Step 3 — Create the Database

Create a PostgreSQL database named:

```text
dhaniti_db
```

The database itself needs to exist before the application connects to it.

The application schema and tables are created through the project's database setup/seed process.

---

### Step 4 — Seed the Database

From the `backend` directory:

```bash
npm run db:seed
```

The seed process:

1. Loads the database schema.
2. Reads the provided CSV datasets.
3. Cleans and normalizes relevant fields.
4. Handles known data-quality issues.
5. Inserts the cleaned records into PostgreSQL.

---

### Step 5 — Start the Backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

### Step 6 — Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The dashboard will be available at:

```text
http://localhost:5173
```

If the frontend configuration uses the development proxy, `VITE_API_BASE_URL` can be omitted for local development.

After changing Vite environment variables, restart the frontend development server.

---

## 7. API Endpoints

### Dashboard Analytics

| Method | Endpoint                       | Description                                    |
| ------ | ------------------------------ | ---------------------------------------------- |
| GET    | `/api/dashboard/summary`       | Portfolio KPIs                                 |
| GET    | `/api/dashboard/status`        | Application status distribution                |
| GET    | `/api/dashboard/courses`       | Course-level demand and loan analytics         |
| GET    | `/api/dashboard/institutions`  | Institution application and approval analytics |
| GET    | `/api/dashboard/credit-scores` | Credit-score distribution                      |
| GET    | `/api/dashboard/insights`      | Calculated portfolio insights                  |
| GET    | `/api/dashboard/data-quality`  | Data-quality observations                      |

### Applications

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| GET    | `/api/applications`              | List applications         |
| GET    | `/api/applications/:id`          | Get application details   |
| POST   | `/api/applications`              | Create an application     |
| PATCH  | `/api/applications/:id/status`   | Update application status |
| GET    | `/api/applications/meta/filters` | Retrieve filter options   |

### Application Filters

The applications endpoint supports parameters such as:

```text
search
status
course
institution
sortBy
order
```

Example:

```text
GET /api/applications?status=Approved&sortBy=loan_amount&order=desc
```

---

## 8. Data Quality Handling

The provided dataset contains several intentional data-quality issues.

The ingestion process handles these issues without silently modifying information that should remain available for review.

| Issue                         | Example                       | Handling                                             |
| ----------------------------- | ----------------------------- | ---------------------------------------------------- |
| Missing credit score          | `EDU1092`                     | Preserved as `NULL` / `N/A`                          |
| State-name typo               | `Telengana`                   | Normalized to `Telangana`                            |
| Trailing whitespace           | `MBA ` / `Website `           | Trimmed during ingestion                             |
| Master-data inconsistency     | Institution/course references | Relational master tables used as the source of truth |
| Loan amount above tuition fee | `EDU1143`                     | Retained and surfaced as an attention condition      |

### Why missing credit scores are preserved

A missing credit score is not treated as a score of zero.

Replacing a missing score with zero would introduce a value that does not exist in the source data and could distort portfolio analytics.

Instead, the value remains missing and can be identified for further verification.

---

## 9. Portfolio Insights

The dashboard calculates several business-oriented observations from the application dataset.

### 1. In-Progress Application Pipeline

The dataset contains:

* 55 applications under review
* 16 submitted applications
* 150 total applications

Calculation:

```text
(55 + 16) / 150 × 100 = 47.3%
```

This represents the proportion of applications that are currently in non-terminal stages.

---

### 2. Medical Loan Ticket Size

MBBS applications have a substantially higher average requested loan amount than BBA applications in the provided dataset.

The comparison is calculated using the average:

```text
loan_amount_requested_inr
```

grouped by course.

---

### 3. Credit Score Distribution by Application Status

Average credit scores can be compared across application statuses while excluding missing credit-score values.

For the supplied dataset:

```text
Approved: approximately 715
Rejected: approximately 656
```

This provides a descriptive view of how credit scores are distributed across application outcomes.

---

### 4. Referral Channel Concentration

The dataset contains multiple application referral channels.

Counsellor, Institution Referral, and Partner Referral account for a substantial portion of the applications.

The dashboard calculates the contribution of each channel to total application volume.

---

### 5. High Debt-to-Income Cases

Applications where existing monthly obligations are greater than or equal to stated monthly income are surfaced for additional attention.

Example rule:

```text
existing_monthly_obligations_inr
    >=
parent_monthly_income_inr
```

These cases are presented as analytical indicators rather than automatic lending decisions.

---

## 10. Attention Level

The application table includes a rule-based **Attention Level** intended to help users identify applications that may require additional review.

### High Attention

Triggered when one or more of the following conditions are met:

* Credit score < 600
* Existing monthly obligations ≥ monthly income
* Requested loan amount > course tuition fee

### Review Required

Triggered when:

* Credit score is between 600 and 680
* FOIR is above 40%
* Credit score is missing

### Low Attention

Applications that do not meet the defined attention conditions.

> **Note:** Attention Level is an illustrative analytics feature for this assignment. It is not intended to represent a formal credit-underwriting policy or automated lending decision.

---

## 11. Key Dashboard Features

### Portfolio Overview

Displays high-level metrics such as:

* Total applications
* Total requested loan amount
* Approved applications
* Applications under review
* Rejected applications
* Approval rate

### Status Analysis

Visualizes the distribution of applications across:

* Submitted
* Under Review
* Approved
* Rejected

### Course Analysis

Provides:

* Application volume by course
* Degree/course distribution
* Average requested loan amount

### Institution Analysis

Provides:

* Application volume by institution
* Approval conversion
* Institution-level portfolio distribution

### Credit Score Analysis

Groups applicants into credit-score ranges:

```text
< 600
600–649
650–699
700–749
750+
Missing
```

### Application Management

Users can:

* Search applications
* Filter applications
* Sort application records
* View detailed application information
* Update application status
* Review attention indicators

---

## 12. Trade-Offs

Given the limited implementation timeframe, several features were intentionally kept outside the core scope.

### Authentication and Authorization

Authentication and role-based access control were not included.

Potential future roles include:

* Credit Officer
* Institution Partner
* Administrator

### Analytics Processing

Dashboard analytics are calculated through database/service queries rather than a separate analytics warehouse or materialized reporting layer.

For a larger production system, frequently requested metrics could be pre-aggregated.

### Data Import

The current workflow is designed around the provided CSV datasets.

A production system could replace or supplement this process with:

* Scheduled ingestion jobs
* External APIs
* Partner integrations
* Event-driven data pipelines

---

## 13. Future Improvements

Potential extensions include:

1. Role-based authentication and authorization.
2. Automated loan-document generation.
3. Credit-bureau integrations for missing credit scores.
4. EMI and repayment simulation.
5. Advanced audit logging.
6. Automated data-quality monitoring.
7. Background processing for large datasets.
8. Pagination and optimized database queries for larger portfolios.
9. Automated testing for API and business-logic layers.
10. Production monitoring and error tracking.

---

## 14. Running the Project

For local development, run the backend and frontend in separate terminals.

### Backend

```bash
cd backend
npm install
npm run db:seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## 15. Project Notes

The project is structured as two independently runnable applications:

* `backend/` — Node.js/Express REST API and database layer
* `frontend/` — React/Vite dashboard interface

Both directories contain their own `package.json` and dependency configuration.

The CSV files under `data/` act as the initial dataset used to populate the PostgreSQL database.
