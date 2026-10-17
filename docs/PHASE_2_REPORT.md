# Phase 2 — Backend Architecture and Database Preparation

Date: 17 October 2026

## Outcome

The Express API was reorganized without changing its public endpoints:

| Legacy endpoint | Preserved behaviour |
| --- | --- |
| `GET /api/health` | Runs a database probe and returns `{ ok: true }`, or the existing 503 unavailable response. |
| `GET /api/items` | Returns the existing item field aliases, ordering, and array response. |
| `POST /api/reservations` | Continues inserting into the existing `reservations` table and returns `201` with `{ id, message }`. |

`backend/server.js` is now only the startup entrypoint. The application is separated into routes, controllers, services, validation, configuration, error types, and centralized error/404 middleware under `backend/src`. JSON payloads are limited to 100 KB. Reservation validation now safely handles positive integer IDs, valid calendar dates, normalized text/email, and field lengths, while retaining the legacy same-day reservation behaviour and error messages for missing/invalid date fields.

This phase intentionally does not add authentication, authorization, rate limiting, CORS policy, transactional availability checks, overlap prevention, or new public APIs. Those require a reviewed product/security design and lifecycle implementation.

## Additive database preparation

`backend/migrations/001_marketplace_foundation.sql` is an **unexecuted** additive migration. It uses InnoDB, foreign keys, indexes, unique constraints, and created/updated timestamps for the new marketplace domain:

- universities, campuses, users, and user-to-campus affiliations
- categories and nullable normalized category/campus/owner references on `items`
- equipment images and time-effective rental pricing using `DECIMAL(10,2)` money columns
- bookings, optional one-to-one legacy reservation links, booking status history, and handovers
- reviews, notifications, disputes, and hashed-token user sessions

The original `items` and `reservations` tables are neither dropped nor renamed. Existing item `owner_user_id`, `campus_id`, and `category_id` values remain `NULL`; no owner identity has been invented. Existing reservations are not backfilled into `bookings` and are not linked to arbitrary users. Legacy API reads and writes continue to target the original tables.

## Required migration approval and order

The migration requires DBA/production-change approval before it can run.

1. Confirm the target database is MySQL with InnoDB support and contains the current `items` and `reservations` tables.
2. Take a consistent, encrypted backup and verify a restore into an isolated environment. Record table row counts and foreign-key checks before the change.
3. Apply `001_marketplace_foundation.sql` in staging through an approved migration runner. Insert its `schema_migrations` marker only after all statements succeed.
4. Validate new table/index/foreign-key creation, existing row counts, and the legacy health/items/reservations paths against staging.
5. Schedule and apply the reviewed migration in production, then repeat the validation. Do not rerun `backend/database.sql`: it is an initialization/seed script, not a production migration.

## Rollback and compatibility limits

MySQL DDL commonly auto-commits. A failed or undesired application cannot be assumed to roll back as one transaction. Restore from the verified backup for a full reversal, or use a separately reviewed forward-fix migration; do not rerun a partially applied SQL file. The migration does not attempt to alter the engine or migrate legacy records.

The new nullable `items` columns avoid failures for legacy equipment. Future code must tolerate unassigned owners and legacy reservations that have no matching `bookings` record. The current legacy reservation implementation still does not lock inventory or prevent overlapping date requests; the new booking indexes prepare for that later implementation but do not itself enforce it.

## Environment and verification

`.env.example` gained optional `DB_CONNECTION_LIMIT=10`; no `.env` file was read or modified.

Database-independent checks executed:

- `npm run check` in `backend` — passed (Node syntax checks for all backend modules).
- `npm test` in `backend` — passed (validator normalization and rejection cases).

No database connection, migration execution, seed execution, data modification, or live endpoint request occurred during Phase 2.
