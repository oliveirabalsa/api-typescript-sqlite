import express, { request } from 'express';
import knex from './database/connection'

const routes = express.Router()

routes.get('/items', async (request, response) => {
  const items = await knex('items').select('*');

  const serializedItems = items.map(item => {
    return {
      id: item.id,
      title:  item.title, 
      image_url: `http://localhost:3333/uploads/${item.image}` 
    }
  })

  return response.json(serializedItems)
})

routes.post('/points', async (request, response) => {
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

   const ids = await knex('points').insert({
    image: 'image-fake',
    name,
    email,
    whatsapp,
    city,
    uf,
    latitude,
    longitude,
   })

   const pointItems = items.map((item_id: number) => {
     return {
       item_id,
       point_id: ids[0]
     }
   })

   await knex('point_items').insert(pointItems);

   return response.json({message: 'success'})
})
export default routes;
