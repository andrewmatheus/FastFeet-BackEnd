import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RecipientController from './app/controllers/RecipientController';
import CourierController from './app/controllers/CourierController';
import OrderController from './app/controllers/OrderController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import ProblemController from './app/controllers/ProblemController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

// DeliveryMan
routes.get('/deliveryman/:id/deliveries', DeliverymanController.index);
routes.post('/deliveryman/:id', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);

routes.get('/delivery/problems', DeliveryProblemController.index);
routes.get(
  '/delivery/:deliveryman_id/problems',
  DeliveryProblemController.view
);
routes.post(
  '/delivery/:deliveryman_id/problems',
  DeliveryProblemController.store
);

routes.delete('/problem/:id/cancel-delivery', ProblemController.delete);

routes.use(authMiddleware);

// Recipient
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

// Courier
routes.get('/couriers', CourierController.index);
routes.post('/couriers', CourierController.store);
routes.put('/couriers/:id', CourierController.update);
routes.delete('/couriers/:id', CourierController.delete);

// Order
routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

// Upload files
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
