import assert from 'node:assert/strict'
import { validateMarketplaceQuery } from '../src/validators/marketplace-validator.js'
assert.equal(validateMarketplaceQuery({ query:'camera', campusId:'2', minPrice:'0', maxPrice:'1000', page:'2' }).page,2)
assert.throws(()=>validateMarketplaceQuery({minPrice:'200',maxPrice:'100'}),/Minimum/)
assert.throws(()=>validateMarketplaceQuery({pageSize:'100'}),/page size/)
assert.throws(()=>validateMarketplaceQuery({sort:'random'}),/sort/)
console.log('marketplace validation tests passed')
