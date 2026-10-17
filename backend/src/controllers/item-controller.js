import { listItems } from '../services/item-service.js'
export async function getItems(_req, res, next) { try { res.json(await listItems()) } catch (error) { next(error) } }
