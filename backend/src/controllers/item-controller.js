import { listItems, publicItem, searchMarketplace } from '../services/item-service.js'
import { AppError } from '../errors/app-error.js'
import { validateMarketplaceQuery } from '../validators/marketplace-validator.js'
export async function getItems(_req, res, next) { try { res.json(await listItems()) } catch (error) { next(error) } }
export async function marketplace(req,res,next){try{res.json(await searchMarketplace(validateMarketplaceQuery(req.query)))}catch(error){next(error)}}
export async function itemDetails(req,res,next){try{const item=await publicItem(Number(req.params.id));if(!item)throw new AppError('Equipment not found.',404);res.json(item)}catch(error){next(error)}}
