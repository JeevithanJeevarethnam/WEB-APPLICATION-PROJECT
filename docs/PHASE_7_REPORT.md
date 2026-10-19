# Phase 7 — Complete Booking and Rental System

Date: 19 October 2026

## Implemented backend workflow

- Added an unapplied Phase 7 migration that defines the booking states `pending`, `approved`, `rejected`, `cancelled`, `active`, `completed`, `overdue`, and `disputed`; payment status; idempotency keys; and two-party pickup/return confirmations.
- Added authenticated booking APIs to request a booking, list borrowings/incoming requests, view participant-only details, approve/reject, and record pickup/return handovers.
- Booking creation derives the borrower from the session, rejects self-booking, validates future inclusive dates, snapshots the item daily price and currency, and calculates `daily rate × inclusive calendar days` on the backend. A client total is never accepted.
- Paid records begin as `pending_offline`; free records are `not_required`. No payment is marked complete by this phase.
- Owner approval opens a MySQL transaction, locks the relevant item row with `SELECT … FOR UPDATE`, locks overlapping approved/active/overdue bookings, rejects a conflict, then writes approval before commit. Requests sharing an item serialize on the locked row.
- A borrower-scoped UUID idempotency key makes repeated create submissions return the existing request.
- Explicit transition rules reject invalid state changes. Two participant confirmations are required to enter `active` at pickup and `completed` at return. Handover records include timestamp, actor, role, and condition notes.

## Tests and verification

- `npm run check` in `backend` — passed.
- `npm test` in `backend` — passed, including valid booking input and invalid transition coverage.
- **Concurrency tests did not run against a dedicated MySQL test database.** The transaction/lock implementation is present and syntax-tested, but live concurrent approval behavior must be tested after the approved migration is applied to an isolated test database. No migration or data change was performed.

## Files

- `backend/migrations/005_booking_workflow.sql`
- `backend/src/validators/booking-validator.js`
- `backend/src/services/booking-service.js`
- `backend/src/controllers/booking-controller.js`
- `backend/src/routes/api-routes.js`
- `backend/test/booking-validator.test.js`
- `backend/package.json`
- `docs/PHASE_7_REPORT.md`
