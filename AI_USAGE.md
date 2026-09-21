# AI Usage Disclosure — Dhaniti Internship Build

## 1. Purpose

AI-assisted development tools were used during the implementation of the Dhaniti Education Lending Application Intelligence Dashboard.

The tools were used as development support for selected implementation tasks, troubleshooting, clarification, and refinement. The overall application structure, feature requirements, implementation decisions, testing, and final verification were reviewed during development.

---

## 2. Areas Where AI Assistance Was Used

### Project Structure and Implementation Support

AI assistance was used to help with parts of the application structure and implementation, including:

* Backend API organization
* Frontend component structure
* PostgreSQL schema setup
* Database queries
* Data-cleaning utilities
* Dashboard calculations
* UI implementation and refinement
* Debugging implementation issues

The project was kept intentionally simple with separate `frontend/` and `backend/` applications, each maintaining its own dependencies and configuration.

---

### Database and Data Handling

AI assistance was used to help work through the relational database design and the provided CSV datasets.

This included assistance with:

* Identifying relationships between applications, institutions, courses, and statuses
* Designing PostgreSQL tables and foreign-key relationships
* Writing SQL queries and aggregations
* Identifying data-quality issues in the supplied dataset
* Implementing normalization and cleaning logic

Important data-handling decisions were reviewed rather than blindly applying generated suggestions.

For example, the missing credit score in `EDU1092` is intentionally preserved as `NULL` rather than being converted to `0` or replaced with an estimated value.

---

### Dashboard Analytics

AI assistance was also used while implementing and refining dashboard calculations such as:

* Application counts
* Approval rates
* Loan amount aggregations
* Course-level statistics
* Institution-level statistics
* Credit-score distributions
* Referral-channel analysis
* Data-quality indicators
* Rule-based attention levels

The resulting calculations were checked against the supplied dataset and the intended business requirements.

---

## 3. Development Decisions Made During Implementation

AI-generated suggestions were not treated as final architectural decisions.

Several implementation choices were made to keep the project aligned with the assignment requirements.

### Separate Frontend and Backend

The project uses two independent applications:

```text
frontend/
backend/
```

Each application has its own:

* `package.json`
* Dependencies
* Environment configuration
* Development scripts

This keeps the frontend and backend independently runnable and makes the API boundary explicit.

---

### Preserve Missing Financial Data

Missing financial information was not automatically replaced with synthetic values.

For example:

```text
Missing credit score → NULL
```

This avoids treating an unknown credit score as a score of zero and keeps the original data condition visible to users.

---

### Keep the Technology Stack Focused

The implementation uses a relatively lightweight stack:

* React
* Vite
* Tailwind CSS
* Node.js
* Express
* PostgreSQL
* Native Fetch API

Additional frameworks or infrastructure were not introduced where they were unnecessary for the assignment.

---

## 4. Manual Review and Verification

The implementation was reviewed during development to verify that the generated or AI-assisted portions behaved as expected.

Checks included:

### Database

* Foreign-key relationships
* Table structure
* Data insertion
* Handling of missing values
* Data-cleaning behavior
* SQL aggregation results

### Backend

* API responses
* Application filtering
* Application lookup
* Status updates
* Request validation
* Error handling

### Frontend

* Dashboard rendering
* API integration
* Filters and search
* Charts and metrics
* Application details
* Status updates
* Attention-level display
* Responsive layout

### Data

Calculated dashboard metrics were compared against the underlying dataset to verify that the displayed values were consistent with the source records.

---

## 5. Role of AI in the Development Process

AI was used as a development assistant rather than as a replacement for understanding or reviewing the implementation.

Typical uses included:

* Exploring implementation approaches
* Generating or refining specific code sections
* Explaining errors
* Debugging issues
* Suggesting SQL queries
* Refining UI components
* Checking implementation alternatives
* Improving code structure where appropriate

The final implementation was reviewed and adjusted to match the assignment requirements and the project's actual architecture.

---

## 6. Final Responsibility

The final project structure, technology choices, business logic, data-handling decisions, testing, and submission were reviewed as part of the development process.

AI assistance was used selectively to accelerate implementation and problem solving while keeping the application understandable, maintainable, and aligned with the assignment requirements.
