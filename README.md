# CampusLend

CampusLend is an inter-campus equipment borrowing and rental platform built with React/Vite, Node.js/Express, and MySQL.

## Important status

This repository is **not production-ready**. Migrations 001–006 are intentionally unapplied. Authentication, listings, bookings, and administration require an approved migrated staging database before demonstration. Several advanced backend APIs do not yet have complete frontend pages. Read `docs/PHASE_10_FINAL_REPORT.md` before deploying.

## Stack and requirements

- React 19 + Vite; Node.js/Express 5; MySQL 8+; bcrypt; cookie sessions and CSRF.
- Node.js 20+, npm 10+, MySQL 8+, and a dedicated local/staging database. Never use production data for testing.

## Setup

1. Install dependencies: `cd backend && npm ci`, then `cd "front end" && npm ci`.
2. Copy `backend/.env.example` to `backend/.env`; configure `DB_*`, `FRONTEND_ORIGIN`, and a unique session cookie name. Use `COOKIE_SECURE=false` only for localhost HTTP.
3. For a new local demonstration database only, run `mysql -u root -p < backend/database.sql`.
4. Back up and review before applying migrations `001_marketplace_foundation.sql` through `006_administration_audit.sql` in numerical order. Record each successful migration in `schema_migrations` as specified by its file.
5. Start services: `cd backend && npm run server`; `cd "front end" && npm run dev`.

## Commands

```sh
cd backend && npm run check && npm test
cd "front end" && npm run build
```

The frontend artifact is `front end/dist`. The Node backend has no build step and requires a Node process manager.

## Roles and API

- Students manage only their listings/bookings.
- Campus admins are server-scoped to shared campuses.
- Super admins are platform-wide; there is no public admin registration.

Create the first super admin only through a reviewed one-time protected database procedure after identity verification; never expose an HTTP signup route. APIs include `/api/auth`, `/api/marketplace`, `/api/equipment`, `/api/bookings`, `/api/dashboard`, `/api/notifications`, and `/api/admin`. Mutating authenticated calls require the session cookie plus `X-CSRF-Token` from `GET /api/auth/csrf`.

## Deployment checklist

- Test migrations, full workflow, concurrency, CORS, CSRF, authorization, and file upload controls on staging.
- Use HTTPS, `COOKIE_SECURE=true`, exact HTTPS `FRONTEND_ORIGIN`, secure database credentials, persistent upload storage, backups/restore drills, error logging, and a scheduler for reminders.
- GitHub Pages builds only the static frontend; it cannot host the Node/MySQL API. Deploy compatible HTTPS frontend and backend services instead.

## Troubleshooting

- Empty marketplace: confirm migrations, database connectivity, verified active owners, and active listings.
- Registration unavailable: seed active universities/campuses after migrations.
- Secure cookies do not work on HTTP localhost; disable only for local development.
