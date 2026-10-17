# Phase 3 — Student Authentication and Role Management

Date: 17 October 2026

## Completion status

Authentication code, frontend pages, authorization middleware, tests, and an unexecuted Phase 3 schema migration are complete. Live registration and sign-in are **not operational yet** because migrations `001` and `002` have not been approved or applied to a database. No database connection, migration, seed script, or data change was performed.

## Implemented API and security controls

| Endpoint | Purpose |
| --- | --- |
| `GET /api/auth/csrf` | Issues/reuses the CSRF cookie and returns its token for request headers. |
| `GET /api/auth/universities` | Returns active universities and campuses for registration. |
| `POST /api/auth/register` | Creates only a `student` role with a bcrypt password hash. |
| `POST /api/auth/login` | Rate-limited sign-in that creates a server-side session. |
| `POST /api/auth/logout` | Revokes the server-side session. |
| `GET /api/auth/me` | Returns the currently authenticated user. |
| `POST /api/auth/forgot-password` | Non-enumerating reset-request response; email delivery/reset completion needs a separately approved mail integration. |
| `PATCH /api/auth/admin/users/:userId/verification` | Campus/super-admin verification workflow, scoped to a shared campus for campus admins. |

Sessions use an opaque, HttpOnly cookie. The database retains only a SHA-256 hash of the per-session secret, an expiry, and revocation time. Neither passwords nor auth/session tokens are written to browser localStorage. Session duration defaults to seven days and is configurable. Cookies use `SameSite=Lax`; `COOKIE_SECURE=true` is required when served over HTTPS.

CSRF protection uses a per-browser double-submit token: state-changing auth requests require both the CSRF cookie and `X-CSRF-Token` header. CORS accepts only `FRONTEND_ORIGIN` (default `http://localhost:5173`) and enables credentials. Login attempts are limited to 10 per 15 minutes per client.

The registration API accepts no role field and always writes `student`, so a browser cannot self-assign admin privileges. `requireAuth` and `requireRole` middleware enforce protected routes and role restrictions. A student may subsequently own or borrow equipment; ownership is independent of the role field.

Verification is `pending`, `verified`, `rejected`, or `suspended`. A configured university email domain automatically sets a matching registration to verified/active. Other registrations remain pending until an authorized campus/super administrator approves them. A submitted student ID is stored only after approval of the migration and is never treated as proof of identity by itself.

## Frontend

The React client now has `AuthContext`, persistent session restoration through `GET /api/auth/me`, a protected profile route, real login, registration, logout, and forgot-password request views. API requests use `credentials: 'include'` and present actual errors instead of demonstration success messages. The homepage was not rewritten.

## Migration requiring approval

`backend/migrations/002_auth_roles_and_verification.sql` must run **after** approved `001_marketplace_foundation.sql`. It changes the prepared role enum to `student`, `campus_admin`, and `super_admin`; adds optional student ID and verification state; and creates reset-token storage. It has not been executed.

Before approval: take and verify a restorable backup, confirm staging has `001`, inspect any existing Phase 2 users for `lender`/`moderator`/`administrator` values and agree a role mapping, then apply and validate in staging before production. MySQL DDL may auto-commit, so rollback requires a verified restore or separately reviewed forward migration.

## Tests executed

- `npm run check` in `backend` — passed.
- `npm test` in `backend` — passed: registration validation, invalid passwords, failed credential validation, bcrypt hashing/verification, reservation validation, and authorization role restriction.
- `npm run build` in `front end` — passed.

Successful database registration, duplicate-email handling, successful login, logout/session persistence, and admin-verification endpoint flows require a migration-approved test database. They were deliberately not run against any database in this phase. The code paths are present but must be integration-tested in that approved environment before describing live authentication as operational.
