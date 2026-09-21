# AI Usage Disclosure — Dhaniti Internship Build

## 1. AI Tools & Environment
* **Tool Used**: Google AI Studio Build (Antigravity Coding Agent powered by Gemini 2.5 / Gemini Flash)
* **Context**: Technical internship assignment for Dhaniti — Education Lending Application Intelligence Dashboard
* **Target Objective**: Complete, production-grade working prototype delivered within an accelerated 1-hour timeframe.

---

## 2. Where AI Helped the Most

1. **Rapid Schema Definition & Normalization**:
   * AI quickly parsed the 5 raw CSV datasets (`education_loan_applications.csv`, `institutions.csv`, `courses.csv`, `statuses.csv`, and `data_dictionary.csv`) and generated a clean, third-normal-form (3NF) relational PostgreSQL schema (`backend/schema.sql`) with foreign keys, composite indexes, and enum constraints.
   * Scanned the 150 records to systematically catch silent data quality issues (e.g., `"Telengana"` spelling in `EDU1134`, whitespace in `"MBA "`, and missing credit score in `EDU1092`).

2. **Full-Stack Scaffolding & Code Generation**:
   * Generated matching backend and frontend architectures without unnecessary bloat or complex boilerplate.
   * Implemented parameterized database queries and sanitization functions in `backend/src/utils/dataCleaner.js`.

3. **Data Aggregation & Mathematical Insights**:
   * Synthesized complex multi-table aggregations (e.g., weighted tuition fees, average loan request by academic domain, approval rate by credit score tier).
   * Formulated the 5 business insights grounded strictly in real numerical calculations rather than generic observations.

---

## 3. Where AI Struggled or Required Architectural Intervention

1. **Architectural Separation vs. Monorepo Tendency**:
   * Standard AI generators often attempt to merge client and server into a single blended folder or invent root-level monorepos with extra build steps.
   * **Correction**: Explicitly enforced two clean, completely decoupled folders (`frontend/` and `backend/`), each with independent `package.json`, scripts, `.env` files, and zero shared dependencies.

2. **Risk of Imputing Corrupt or Synthetic Data**:
   * AI default data cleaning routines frequently try to replace missing numerical values with dataset averages (mean imputation) or replace null credit scores with zero (`0`).
   * **Correction**: Enforced strict financial domain logic: credit score for `EDU1092` must remain `NULL` in the database and display as `N/A (Missing)` in the user interface. Imputing zero falsely labels the student delinquent, whereas imputing the mean fabricates an unverified credit history.

3. **Restricting Scope to Fit 1-Hour Constraint**:
   * Initial boilerplate models often introduce unnecessary abstractions like Docker compose files, TypeScript compilation layers, authentication middleware, or heavy state management libraries (Redux/Zustand).
   * **Correction**: Kept the stack strictly to standard JavaScript, Express, React, Tailwind, and native `fetch` to ensure maximum code readability and rapid reviewability.

---

## 4. Manual Verification & Quality Checks Performed

* **SQL & Relational Constraints**: Manually verified foreign key links between `applications.institution_id -> institutions.institution_id` and `applications.course_id -> courses.course_id`.
* **API Endpoints**: Tested all endpoints (`/api/dashboard/summary`, `/api/dashboard/status`, `/api/applications`, `/api/applications/:id/status`) against edge cases (empty search results, invalid status values, malformed request bodies).
* **Number Formatting**: Formatted Indian Rupee currency values with Lakhs (`₹L`) and Crores (`₹Cr`) notation for natural readability by Indian banking and underwriting teams.

---

## 5. Impact on Development Speed & Architecture

* **Speedup**: Building the complete working prototype took approximately 45–50 minutes instead of the standard 6–8 hours required for manual boilerplate, CSS styling, and schema tuning.
* **Architectural Clarity**: Allowed focus to remain on core business logic—such as portfolio risk metrics, fixed obligation ratios (FOIR), and data cleaning transparency—while maintaining clean, maintainable code.
