import { Router } from 'express'
import { health } from '../controllers/health-controller.js'
import { getItems } from '../controllers/item-controller.js'
import { createReservation } from '../controllers/reservation-controller.js'
import { csrf, currentUser, forgotPassword, login, logout, register, universities, updateUserVerification } from '../controllers/auth-controller.js'
import { requireAuth, requireCsrf, requireRole } from '../middleware/auth.js'
import { loginRateLimit } from '../middleware/login-rate-limit.js'
export const apiRouter = Router(); apiRouter.get('/health', health); apiRouter.get('/items', getItems); apiRouter.post('/reservations', createReservation)
apiRouter.get('/auth/csrf', csrf); apiRouter.get('/auth/universities', universities); apiRouter.post('/auth/register', requireCsrf, register); apiRouter.post('/auth/login', loginRateLimit, requireCsrf, login); apiRouter.post('/auth/logout', requireCsrf, requireAuth, logout); apiRouter.get('/auth/me', requireAuth, currentUser); apiRouter.post('/auth/forgot-password', requireCsrf, forgotPassword)
apiRouter.patch('/auth/admin/users/:userId/verification', requireCsrf, requireAuth, requireRole('campus_admin', 'super_admin'), updateUserVerification)
