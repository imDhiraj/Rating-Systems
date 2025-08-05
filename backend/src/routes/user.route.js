import express from 'express';
import { createUserWithAdmin, getAllUsers, getUserById } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkAdminRole } from '../middleware/role.middleware.js';

const userAdminRouter = express.Router();

userAdminRouter.get('/getallusers',authMiddleware,checkAdminRole,getAllUsers)
userAdminRouter.get('/getuserbyID/:userId',authMiddleware,checkAdminRole, getUserById);
userAdminRouter.post('/createuserwithadmin',authMiddleware,checkAdminRole, createUserWithAdmin);




export default userAdminRouter;