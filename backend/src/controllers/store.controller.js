
import { prisma } from "../libs/db.js";



export const getAllStores = async (req, res) => {
    try {
        const stores = await prisma.store.findMany();
        return res.status(200).json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const getRatingsForStore = async (req, res) => { 
    try {
        const storeId = req.params.id;
        if (isNaN(storeId)) {
            return res.status(400).json({ message: 'Invalid store ID' });
        }

      const ratings = await prisma.rating.findMany({
            where: { storeId },
            include: { user: true },
        });

        if (!ratings.length) {
            return res.status(404).json({ message: 'No ratings found for this store' });
        }

        return res.status(200).json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const createStore = async (req, res) => {
    const { name, address ,ownerId } = req.body;
    try {
        // Validate input data
        if (!name || !address || !ownerId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new store
        const newStore = await prisma.store.create({
            data: {
                name,
                address,
                ownerId:  ownerId , // Assuming ownerId is the ID of the user who owns the store
            },
        });

        return res.status(201).json({ message: 'Store created successfully', store: newStore });
    } catch (error) {
        console.error('Error creating store:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}