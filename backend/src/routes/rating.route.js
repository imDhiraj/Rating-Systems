import express from 'express';
//import { submitRating, updateRating } from '../controllers/rating.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { submitOrUpdateRating } from '../controllers/rating.controller.js';

const ratingsRouter = express.Router();

// ratingsRouter.post('/submit-rating',authMiddleware,submitRating)
// ratingsRouter.put('/update-rating/:ratingId',authMiddleware, updateRating);

ratingsRouter.post('/rate', authMiddleware, submitOrUpdateRating);



export default ratingsRouter;