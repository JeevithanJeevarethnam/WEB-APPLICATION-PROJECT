import assert from 'node:assert/strict'
import { validateLegacyReservation } from '../src/validators/reservation-validator.js'

const valid = validateLegacyReservation({ itemId: '2', borrowerName: ' Ada ', email: 'ADA@EXAMPLE.COM ', startDate: '2026-10-20', endDate: '2026-10-21', notes: '  Hi  ' })
assert.deepEqual(valid, { itemId: 2, borrowerName: 'Ada', email: 'ada@example.com', startDate: '2026-10-20', endDate: '2026-10-21', notes: 'Hi' })
assert.throws(() => validateLegacyReservation({ itemId: 1, borrowerName: 'Ada', email: 'ada@example.com', startDate: '2026-02-30', endDate: '2026-03-01' }))
assert.throws(() => validateLegacyReservation({ itemId: 1, borrowerName: 'Ada', email: 'invalid', startDate: '2026-10-21', endDate: '2026-10-20' }))
