# Phase 6 — Equipment Marketplace and Advanced Search

Date: 19 October 2026

## Delivered

- Added public `GET /api/marketplace` search with validated title, category, university, campus, free/paid, price, availability, condition, sort, page, and page-size parameters.
- Added public `GET /api/marketplace/:id` detail data with a gallery, campus and pickup summary, rental rules, availability, and owner display name/verification indicator. Email and private contact fields are never selected.
- Public queries exclude inactive/deleted, unavailable, unowned, and unverified/inactive-owner listings. Results are bounded (maximum 48 per page) and have stable sorting.
- Added an unapplied Phase 6 index migration for common public-marketplace predicates.
- Replaced the homepage catalogue fetch with the marketplace API and removed the silent demo catalogue fallback. Server failures now present an error state.
- Added URL-query-driven marketplace search, loading/error/empty states, result count, clear filters, pagination, responsive cards, and an equipment detail view. Booking is explicitly disabled until Phase 7.
- Added query-validation tests for combined valid filters, invalid price ranges, invalid pagination, and invalid sort values.

## Verification

- `npm run check` in `backend` — passed.
- `npm test` in `backend` — passed.
- `npm run build` in `front end` — passed.

The backend does not define a build script; no database migration was executed. Apply `004_marketplace_search_indexes.sql` only through the approved migration process after Phase 3 and Phase 5 migrations.

## Modified files

- `backend/migrations/004_marketplace_search_indexes.sql`
- `backend/src/validators/marketplace-validator.js`
- `backend/src/services/item-service.js`
- `backend/src/controllers/item-controller.js`
- `backend/src/routes/api-routes.js`
- `backend/test/marketplace-validator.test.js`
- `backend/package.json`
- `front end/src/main.jsx`
- `docs/PHASE_6_REPORT.md`
