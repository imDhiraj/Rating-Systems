import express from 'express';
import { createStore, getAllStores, getRatingsForStore } from '../controllers/store.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkAdminRole, checkOwnerRole } from '../middleware/role.middleware.js';

const storeRouter = express.Router();

storeRouter.get('/get-all-stores',authMiddleware,checkAdminRole,getAllStores)
storeRouter.get('/get-ratings-for-store',authMiddleware,checkOwnerRole, getRatingsForStore);
storeRouter.post('/create-store',authMiddleware,checkAdminRole, createStore);



export default storeRouter;