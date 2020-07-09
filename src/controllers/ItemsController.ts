import knex from '../database/connection'
import { Request, Response } from 'express'

class ItemsController {
  async all(request: Request, response: Response) {
    const items = await knex('items').select('*');
  
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title:  item.title, 
        image_url: `http://localhost:3333/uploads/${item.image}` 
      }
    })
  
    return response.json(serializedItems)
  }

  async one(request: Request, response: Response) {

    const { id } = request.params;

    const item = await knex('items').where('id', id).first();
     
    return response.json(item)
  }
}

export default new ItemsController();