# Phase 8 — Student Dashboard, Notifications and Reviews

Date: 19 October 2026

## Delivered backend APIs

- `GET /api/dashboard`: authenticated student profile/verification summary, owned-equipment count, active borrowing count, incoming requests, upcoming/overdue returns, unread notification count, and recent booking activity.
- `GET /api/notifications?unread=true` and `PATCH /api/notifications/:id/read`: database-backed, current-user-only notification access and read acknowledgement.
- `POST /api/bookings/:id/reviews`: completed-booking participant-only review creation, rating/comment validation, and database-enforced duplicate-review prevention.
- Existing Phase 7 routes provide owner-scoped incoming requests and borrower-scoped borrowings; no student identifier is accepted by dashboard or notification APIs.

## Scheduling and delivery boundary

Notifications are persisted in the existing `notifications` table. No real-time transport is implemented or claimed. Pickup, return, and overdue reminders require an approved scheduler/worker deployment that creates notification rows on a schedule; this repository does not include such a production scheduler configuration.

## Verification

- New dashboard validation smoke test added.
- Source syntax checks were run for the dashboard controller and service.
- Database-backed ownership, unread-count, review-eligibility, and duplicate-review integration tests require an approved isolated MySQL test database and were not run here.

## Files

- `backend/src/services/dashboard-service.js`
- `backend/src/controllers/dashboard-controller.js`
- `backend/src/routes/api-routes.js`
- `backend/test/dashboard-validator.test.js`
- `docs/PHASE_8_REPORT.md`
