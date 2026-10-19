import { Router } from 'express'
import { health } from '../controllers/health-controller.js'
import { getItems, itemDetails, marketplace } from '../controllers/item-controller.js'
import { createReservation } from '../controllers/reservation-controller.js'
import { createReview, getDashboard, getNotifications, read } from '../controllers/dashboard-controller.js'
import { create as createBooking, decision, details, handover, list } from '../controllers/booking-controller.js'
import { csrf, currentUser, forgotPassword, login, logout, register, universities, updateUserVerification } from '../controllers/auth-controller.js'
import { requireAuth, requireCsrf, requireRole } from '../middleware/auth.js'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import { create, deactivate, listMine, remove, removeImage, update, upload } from '../controllers/equipment-controller.js'
import { loginRateLimit } from '../middleware/login-rate-limit.js'
export const apiRouter = Router(); apiRouter.get('/health', health); apiRouter.get('/items', getItems); apiRouter.post('/reservations', createReservation)
apiRouter.get('/marketplace', marketplace); apiRouter.get('/marketplace/:id', itemDetails)
apiRouter.post('/bookings', requireCsrf, requireAuth, createBooking)
apiRouter.get('/bookings/borrowings', requireAuth, list('borrowings'))
apiRouter.get('/bookings/incoming', requireAuth, list('incoming'))
apiRouter.get('/bookings/:id', requireAuth, details)
apiRouter.patch('/bookings/:id/decision', requireCsrf, requireAuth, decision)
apiRouter.post('/bookings/:id/handover', requireCsrf, requireAuth, handover)
apiRouter.get('/dashboard', requireAuth, getDashboard)
apiRouter.get('/notifications', requireAuth, getNotifications)
apiRouter.patch('/notifications/:id/read', requireCsrf, requireAuth, read)
apiRouter.post('/bookings/:id/reviews', requireCsrf, requireAuth, createReview)
apiRouter.get('/auth/csrf', csrf); apiRouter.get('/auth/universities', universities); apiRouter.post('/auth/register', requireCsrf, register); apiRouter.post('/auth/login', loginRateLimit, requireCsrf, login); apiRouter.post('/auth/logout', requireCsrf, requireAuth, logout); apiRouter.get('/auth/me', requireAuth, currentUser); apiRouter.post('/auth/forgot-password', requireCsrf, forgotPassword)
apiRouter.patch('/auth/admin/users/:userId/verification', requireCsrf, requireAuth, requireRole('campus_admin', 'super_admin'), updateUserVerification)
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const storage = multer.diskStorage({ destination: 'uploads/', filename: (_req, file, done) => done(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`) })
const images = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 6 }, fileFilter: (_req, file, done) => done(null, imageTypes.has(file.mimetype)) })
apiRouter.get('/equipment/mine', requireAuth, listMine)
apiRouter.post('/equipment', requireCsrf, requireAuth, create)
apiRouter.put('/equipment/:id', requireCsrf, requireAuth, update)
apiRouter.patch('/equipment/:id/deactivate', requireCsrf, requireAuth, deactivate)
apiRouter.delete('/equipment/:id', requireCsrf, requireAuth, remove)
apiRouter.post('/equipment/:id/images', requireCsrf, requireAuth, images.array('images', 6), upload)
apiRouter.delete('/equipment/:id/images/:imageId', requireCsrf, requireAuth, removeImage)
