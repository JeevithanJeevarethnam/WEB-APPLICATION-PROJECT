import { AppError } from '../errors/app-error.js'
export function notFound(_req, res) { res.status(404).json({ message: 'Route not found.' }) }
export function errorHandler(error, _req, res, _next) { if (error instanceof AppError) return res.status(error.statusCode).json({ message: error.message }); console.error(error); return res.status(500).json({ message: 'Something went wrong. Please try again.' }) }
