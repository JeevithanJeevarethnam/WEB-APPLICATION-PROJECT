import assert from 'node:assert/strict'
import { validateEquipment } from '../src/validators/equipment-validator.js'
const valid = { name:'Camera',category:'Cameras',description:'A camera',condition:'Good',campusId:'1',pickupLocation:'Library',rentalType:'paid',rentalPricePerDay:'500',availableFrom:'2026-10-20',availableUntil:'2026-10-21' }
assert.equal(validateEquipment(valid).rentalPricePerDay,500)
assert.throws(() => validateEquipment({ ...valid, rentalPricePerDay:'-1' }), /zero or greater/)
assert.throws(() => validateEquipment({ ...valid, campusId:'0' }), /campus/)
assert.throws(() => validateEquipment({ ...valid, availableUntil:'2026-10-01' }), /Availability/)
console.log('equipment validation tests passed')
