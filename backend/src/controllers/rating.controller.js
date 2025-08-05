import { prisma } from "../libs/db.js";

export const submitOrUpdateRating = async (req, res) => {
  const { storeId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    if (!storeId || rating === undefined) {
      return res.status(400).json({ message: 'Store ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const upsertedRating = await prisma.rating.upsert({
      where: {
        storeId_userId: {
          storeId,
          userId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        storeId,
        userId,
        rating,
        comment,
      },
    });

    return res.status(200).json({
      message: 'Rating submitted or updated successfully',
      rating: upsertedRating,
    });
  } catch (error) {
    console.error('Error upserting rating:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
