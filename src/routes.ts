import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router()

routes.get('/items', ItemsController.all)
routes.get('/items/:id', ItemsController.one)
routes.get('/points', PointsController.all)
routes.get('/points/:id', PointsController.one)
routes.post('/points', PointsController.save)

export default routes;
