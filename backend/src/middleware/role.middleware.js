
import { prisma } from "../libs/db.js";


export const checkAdminRole = async (req, res, next) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error checking admin role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const checkOwnerRole = async (req, res, next) => {   
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
        const storeId = req.params.storeId; 
        if (isNaN(storeId)) {
            return res.status(400).json({ message: 'Invalid store ID' });
        }

        const store = await prisma.store.findUnique({ where: { id: storeId } });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        if (store.ownerId !== userId) {
            return res.status(403).json({ message: 'Access denied. Owners only.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error checking owner role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}