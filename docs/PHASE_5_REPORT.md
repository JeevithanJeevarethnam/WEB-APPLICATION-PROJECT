# Phase 5 — Student Equipment Management System

Date: 19 October 2026

## Delivered

- Added an unapplied, additive `003_student_equipment_management.sql` migration. It extends `items` without altering existing records, adds listing/availability/rental fields, and adds image metadata fields.
- Added authenticated equipment APIs for creating, listing a student's equipment, editing, deactivating, soft-deleting, uploading multiple images, and removing image metadata.
- Ownership is derived exclusively from `req.user.id`; no owner ID is accepted from the browser. Owner-scoped SQL prevents one student from editing another student's listing.
- Active bookings (`pending`, `approved`, `collected`, or `overdue`) block deactivation and removal. Removal is a soft delete, preserving historical booking references.
- Added input validation, parameterized SQL, rental-price/date validation, CSRF protection for mutations, MIME allowlisting (JPEG, PNG, WebP), a 5 MB per-image limit, six-image limit, generated UUID filenames, and static serving only from the upload directory.
- Added React pages reachable at `#my-equipment` and `#add-equipment`, including add/edit forms, photo selection, listing management, loading, success, error, and empty states.
- Added backend validator tests for valid pricing, negative pricing, campus validation, and invalid availability ranges.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/equipment/mine` | Authenticated student's listings |
| POST | `/api/equipment` | Create owned listing |
| PUT | `/api/equipment/:id` | Update owned listing |
| PATCH | `/api/equipment/:id/deactivate` | Deactivate if no active booking |
| DELETE | `/api/equipment/:id` | Soft-delete if no active booking |
| POST | `/api/equipment/:id/images` | Upload up to six allowed images |
| DELETE | `/api/equipment/:id/images/:imageId` | Remove owned image metadata |

## Verification

- `npm run check` in `backend` — passed.
- `npm test` in `backend` — passed, including Phase 5 equipment validation tests.
- `npm run build` in `front end` — passed.

The backend has no `build` script; attempting it correctly reported that no such script exists. No migration or database data was applied or modified.

## Files added or modified

- `backend/migrations/003_student_equipment_management.sql`
- `backend/src/validators/equipment-validator.js`
- `backend/src/services/equipment-service.js`
- `backend/src/controllers/equipment-controller.js`
- `backend/src/routes/api-routes.js`
- `backend/src/app.js`
- `backend/src/middleware/error-handler.js`
- `backend/test/equipment-validator.test.js`
- `backend/package.json`, `backend/package-lock.json`
- `backend/uploads/.gitkeep`
- `front end/src/main.jsx`
- `docs/PHASE_5_REPORT.md`
