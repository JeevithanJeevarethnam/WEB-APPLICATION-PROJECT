import { Router } from 'express'
import { health } from '../controllers/health-controller.js'
import { getItems } from '../controllers/item-controller.js'
import { createReservation } from '../controllers/reservation-controller.js'
import { csrf, currentUser, forgotPassword, login, logout, register, universities, updateUserVerification } from '../controllers/auth-controller.js'
import { requireAuth, requireCsrf, requireRole } from '../middleware/auth.js'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import { create, deactivate, listMine, remove, removeImage, update, upload } from '../controllers/equipment-controller.js'
import { loginRateLimit } from '../middleware/login-rate-limit.js'
export const apiRouter = Router(); apiRouter.get('/health', health); apiRouter.get('/items', getItems); apiRouter.post('/reservations', createReservation)
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
