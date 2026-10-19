import express from 'express'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { apiRouter } from './routes/api-routes.js'
import { errorHandler, notFound } from './middleware/error-handler.js'
export function createApp() {
  const app = express()
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
  app.use(cors({ origin: frontendOrigin, credentials: true }))
  app.use(express.json({ limit: '100kb' }))
  app.use('/uploads', express.static(path.resolve('uploads'), { fallthrough: false, index: false }))
  app.use(cookieParser())
  app.use('/api', apiRouter)
  app.use(notFound)
  app.use(errorHandler)
  return app
}
