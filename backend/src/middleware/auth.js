import { AppError } from '../errors/app-error.js'
import { csrfCookieName, sessionCookieName } from '../config/auth.js'
import { getSessionUser } from '../services/auth-service.js'
export async function requireAuth(req, _res, next) { try { const user = await getSessionUser(req.cookies?.[sessionCookieName]); if (!user) throw new AppError('Authentication is required.', 401); req.user = user; next() } catch (error) { next(error) } }
export function requireRole(...roles) { return (req, _res, next) => roles.includes(req.user?.role) ? next() : next(new AppError('You do not have permission to perform this action.', 403)) }
export function requireCsrf(req, _res, next) { const csrfHeader = req.get('x-csrf-token'); if (!csrfHeader || csrfHeader !== req.cookies?.[csrfCookieName]) return next(new AppError('Invalid CSRF token.', 403)); return next() }
