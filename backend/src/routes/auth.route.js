import express from 'express';

const userRouter = express.Router();
import { logoutUser, registerUser, resetPassword, signInUser } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

userRouter.post('/register',registerUser)
userRouter.post('/login', signInUser);
userRouter.post('/logout', authMiddleware, logoutUser);
userRouter.put('/reset-password',authMiddleware, resetPassword)



export default userRouter;