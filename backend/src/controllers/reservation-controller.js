import { AppError } from '../errors/app-error.js'
import { findItemAvailability } from '../services/item-service.js'
import { createLegacyReservation } from '../services/reservation-service.js'
import { validateLegacyReservation } from '../validators/reservation-validator.js'
export async function createReservation(req, res, next) { try { const reservation = validateLegacyReservation(req.body); const item = await findItemAvailability(reservation.itemId); if (!item || !item.available) throw new AppError('That item is no longer available.', 409); const id = await createLegacyReservation(reservation); res.status(201).json({ id, message: 'Your request has been sent.' }) } catch (error) { next(error) } }
