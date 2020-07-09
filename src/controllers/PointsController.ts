import knex from '../database/connection'
import { Request, Response, response } from 'express'

class PointsController {
  async save(request: Request, response: Response) {
    try {
      const {
        name,
        email,
        whatsapp,
        city,
        uf,
        latitude,
        longitude,
        items
      } = request.body;

      const trx = await knex.transaction()

      const point = {
        image: 'image-fake',
        name,
        email,
        whatsapp,
        city,
        uf,
        latitude,
        longitude,
      };

      const insertedIds = await trx('points').insert(point)
      const point_id = insertedIds[0]

      const pointItems = items.map((item_id: number) => {
        return {
          item_id,
          point_id
        }
      })
      await trx('point_items').insert(pointItems);

      await trx.commit();

      return response.json({ id: point_id, ...point, items })

    } catch (error) {
      return response.json({ error: error.message })
    }
  }
  async one(request: Request, response: Response) {

    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if(!point) {
      return response.status(400).json({message: 'Point not found'})
    }
 
    const items = await knex('items')
    .join('point_items', 'items.id', '=', 'point_items.item_id')
    .where('point_items.point_id', id)
    .select('items.title')

    return response.json({point, items})
  }
  async all(request: Request, response: Response) {
    const { city, uf, items } = request.query;
    
    const parsedItems = String(items)
    .split(',')
    .map(item => item.trim())

    const points = await knex('points')
    .join('point_items', 'points.id', '=', 'point_items.point_id')
    .whereIn('point_items.item_id', parsedItems)
    .where('city', String(city))
    .where('uf', String(uf))
    .distinct()
    .select('points.*');

    return response.json(points)
  }
}

export default new PointsController();