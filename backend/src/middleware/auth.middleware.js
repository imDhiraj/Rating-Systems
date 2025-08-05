
import { prisma } from "../libs/db.js";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


export const authMiddleware = async (req, res, next) => {
    try {
        const token= req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is required' });
        }   
        // Verify the token (assuming you have a function to verify JWT)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);      
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid authentication token' });
        }       
        // Attach user information to the request object
        req.user = decoded; // Assuming decoded contains user information

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            message:"error Authentcating user"
        })

    }
}