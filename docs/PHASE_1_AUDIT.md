# Phase 1 — CampusLend Project Review

Audit date: 16 October 2026. This was a source-level, read-only review of the current workspace. No application code, database records/schema, migration, deployment, or `.env` file was changed.

## Current project structure

```text
.
├── front end/                    React + Vite single-page frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/main.jsx, src/styles.css
├── backend/                      Express + MySQL API
│   ├── server.js
│   ├── database.sql
│   ├── package.json
│   └── .env.example
├── .github/workflows/deploy.yml  GitHub Pages frontend deployment
└── README.md
```

The frontend is a React app with all views and client logic in `front end/src/main.jsx`; all styling is in `front end/src/styles.css`. The backend is one Express module using `mysql2/promise`. There are no tests, linting configuration, component/route modules, migration framework, ORM, or backend CI checks.

```text
React/Vite browser app → /api requests → Vite local proxy → Express → MySQL
GitHub Pages workflow → static frontend only (no Express/MySQL deployment)
```

## Existing features

### Frontend

| Page/component | Evidence and current behaviour |
| --- | --- |
| `HomePage` | Marketing home page, hero, categories and borrowing steps. |
| `HowPage` | Static explanation of the borrowing process. |
| `DiscoverPage` | Catalogue cards, client-side category filtering and reservation form. |
| `JoinPage` | Email-only onboarding form and confirmation message. |
| `LoginPage` | Email/password form and confirmation message. |
| `App` | Hash-based page state for `home`, `how`, `discover`, `join`, `login`, and `signin`; shared header/footer. |
| CSS | Responsive rules at 800px and 430px, responsive cards/columns/forms, branded visual system. |

### Backend

| Route | Current behaviour |
| --- | --- |
| `GET /api/health` | Runs `SELECT 1`; returns success or 503. |
| `GET /api/items` | Returns selected inventory fields ordered by availability and name. |
| `POST /api/reservations` | Requires item/name/email/date fields, compares dates, checks item availability, inserts a pending reservation. |

### Database

`backend/database.sql` defines:

- `items`: catalogue metadata, location, emoji image marker, condition, availability, timestamp.
- `reservations`: item foreign key, borrower name/email, dates, notes, status enum (`pending`, `approved`, `declined`, `returned`), timestamp.

The reservation queries use parameter placeholders, which is a sound starting point for SQL-injection protection of those values. The frontend uses a local Vite `/api` proxy, the Express server uses environment-configured MySQL connection-pool settings, and the Pages workflow correctly builds the frontend directory.

## Features not actually implemented

- Registration, real login/logout, password hashing, sessions/tokens, campus verification, user accounts, roles, or authorization.
- User profiles and borrower/lender dashboards.
- Student-owned equipment listings; the schema has no item owner/lender.
- Create/edit/delete listings, image uploads, search, pagination, or moderation.
- Owner review, approve/decline/cancel/return workflows, booking calendar, pickup/return records, notifications, messages, reviews, payments/deposits, disputes, or overdue handling.
- Privacy, terms, contact, and category destination pages.
- Automated tests, linting, monitoring, logging policy, health/readiness checks, or graceful shutdown.

## Fake states and hardcoded fallback data

The following source evidence means these flows must not be represented as live marketplace features:

- `demoItems` in `front end/src/main.jsx` provides four hardcoded items when `GET /api/items` fails, without an offline/demo label.
- On a failed reservation request the frontend closes the form and says the request is “saved for now,” but the catch branch stores nothing.
- `LoginPage` makes no API request and accepts any browser-valid email/password before displaying “You’re signed in!”.
- `JoinPage` makes no API request and displays a promise to send a setup link.
- Hero claims (“2,000+ students” and named institutions) are static text rather than data-backed metrics.

## Bugs, broken routes, and security issues

### Important issues to fix first

1. **The production API is absent.** `.github/workflows/deploy.yml` publishes only static Vite output to GitHub Pages. `vite.config.js` proxies `/api` only in local development. The deployed site therefore has no configured Express API/database host.
2. **Booking failure is reported as success.** The reservation network-error handler reports a saved request without persisting it. A user can believe equipment is reserved when it is not.
3. **No authentication or authorization.** Anyone can create a request under any name/email. There is no protection for future owner/admin functions.
4. **Reservation conflicts are not prevented.** The server separately reads `items.available` then inserts a reservation. It never changes availability and does not query date overlap, so concurrent or overlapping requests can overbook equipment.
5. **No rate limiting or abuse protection.** Public endpoints can be spammed and create unwanted reservation records.

### Other backend and data risks

- Server validation only checks field presence and one date comparison. It does not validate a positive integer item ID, email/campus domain, date validity/past dates, whitespace, field lengths, or normalized input.
- `new Date()` date comparison is timezone-sensitive and invalid dates can bypass a simple comparison.
- The availability read and write are not transactional; no locking or idempotency key exists.
- There is no explicit JSON body limit, security header middleware, CORS policy for a separately hosted frontend, request schema library, or structured/sanitized logging.
- Names, email addresses, and notes are retained without consent text, access controls, retention/deletion policy, or audit log.
- The error middleware logs raw errors; response messages are generic, but logs may expose operational/database detail.
- `GET /api/items` has no pagination, search, category query, or API versioning.
- Frontend dependencies use `latest`, reducing future install reproducibility even with a lockfile. Vite/plugin packages should normally be development dependencies.

### Navigation, responsive design, and accessibility

- The 800px breakpoint hides the home-page navigation links and Log in button without providing a mobile menu. Only the join action remains visible.
- `#photo`, `#audio`, `#outdoor`, `#terms`, `#privacy`, and `#contact` link targets have no matching page content; unknown hashes revert to home.
- Responsive reflow for grids, cards, page navigation, and reservation fields is present and reusable.
- No skip link, visible keyboard focus treatment, modal focus management, or robust accessible server-error presentation is evident.
- Google Fonts are fetched from a third party, which is a privacy/availability decision to make deliberately.

## Database improvements needed

`database.sql` is an initialization/seed script, not a migration system. It uses `CREATE DATABASE`, `USE`, and inserts sample items. Re-running it can duplicate seeded rows because there is no unique seed guard. Do not use it as a production migration.

Future additive migrations should introduce, at minimum:

- `users`, campus affiliation/verification, roles, and secure account/session records.
- Item/listing ownership, image assets, rental terms, condition/history, maintenance, and moderated status.
- Availability/calendar entries and a reservation-event history rather than only the global `available` flag.
- Reservation states such as cancelled, collected, overdue, and completed, plus pickup/return evidence.
- Indexes for item filters/search and item/date-range reservation queries.
- Constraints and transactional checks preventing invalid or overlapping active reservations.
- Notification, review/report, and audit records appropriate to the agreed trust/safety model.

Keep current `items` and `reservations` tables intact initially. Add new tables/nullable columns/indexes through versioned migrations only after staging backup and rollback planning.

## Website design improvements

Preserve the established visual language initially, but improve the product experience with:

- A real responsive/mobile navigation menu and working destination pages.
- Clear online/offline/demo status; never present unsaved booking attempts as successful.
- Search, campus/category/date filters, availability calendar, listing detail view, pricing/terms, and owner identity/trust information.
- Validated fields, inline errors, loading/empty/error states, and accessible focus/announcement behaviour.
- Borrower and lender dashboards showing request status, pickup/return instructions, and actions.
- Real legal/privacy/contact content before collecting personal information.

## Recommended step-by-step development plan

1. Select a production API and MySQL hosting approach; configure an explicit production API base URL. GitHub Pages may remain the frontend host, but it cannot run the Express API.
2. Replace fake login/join/booking-success messages with accurate unavailable states while live backend work is pending.
3. Add tests, linting/formatting, dependency policy, backend CI checks, and environment validation without changing the stack or visual design.
4. Design user roles (borrower, verified lender, campus department, moderator/admin) and add authentication with password hashing or approved campus SSO, sessions/tokens, and server-side authorization.
5. Introduce a migration tool and additive schema migrations; back up and verify staging before any production data work.
6. Add owner-linked listings, images, searchable categories, pickup details, rental terms, and moderation.
7. Implement transactional reservation availability, overlap prevention, owner decisions, cancellation, pickup/return, notification, and audit lifecycle.
8. Add trust/safety controls, privacy/retention policy, reporting/dispute paths, reviews, and overdue procedures.
9. Complete responsive navigation, accessibility remediation, legal pages, monitoring, and end-to-end test coverage.

## Non-destructive migration strategy

1. Back up the database and test restore procedures before later schema work; never re-run the seed script as a production migration.
2. Add a migrations directory/tool and apply only versioned, append-only migrations in staging first.
3. Retain `items` and `reservations`; add new user/ownership/calendar/event tables instead of dropping or renaming existing tables.
4. Add nullable fields and indexes first, then approved backfills for legacy anonymous borrower records.
5. Release API changes able to read legacy and new structures; move frontend flows gradually behind a feature flag/beta path.
6. Verify data counts, foreign-key integrity, conflict handling, backups, and rollback in staging before enabling live bookings.
7. Deprecate nothing until retention, export, rollback, and production verification requirements are satisfied.

## Verification limits

This review inspected the current source files, manifests, SQL initialization script, and GitHub Actions workflow. It did **not** start the API, connect to MySQL, execute SQL, inspect `.env`, submit a live reservation, test a deployment, or run migrations. Runtime and production claims beyond the code evidence above are therefore unverified.
