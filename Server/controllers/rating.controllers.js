import Rating from '../models/rating.model.js';
import User from '../models/user.model.js';
import Item from '../models/item.model.js';

export const createRating = async (req, res) => {
    try {
        const { ratedUserId, itemId, rating, comment, transactionType } = req.body;
        const raterId = req.userId;

        // Validate required fields
        if (!ratedUserId || !itemId || !rating || !transactionType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if user can rate (must be involved in the transaction)
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if rater is involved in the transaction
        const isOwner = item.owner.toString() === raterId;
        const isSelectedUser = item.selectedUser && item.selectedUser.toString() === raterId;
        const isInterestedUser = item.interestedUsers.includes(raterId);

        if (!isOwner && !isSelectedUser && !isInterestedUser) {
            return res.status(403).json({ message: 'You can only rate users involved in this transaction' });
        }

        // Check if user has already rated this item
        const existingRating = await Rating.findOne({ rater: raterId, item: itemId });
        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this transaction' });
        }

        // Create rating
        const newRating = new Rating({
            rater: raterId,
            rated: ratedUserId,
            item: itemId,
            rating,
            comment,
            transactionType
        });

        await newRating.save();

        // Update user's average rating
        await updateUserRating(ratedUserId);

        // Populate the response
        await newRating.populate([
            { path: 'rater', select: 'name userName profilePicture' },
            { path: 'rated', select: 'name userName profilePicture' },
            { path: 'item', select: 'title' }
        ]);

        res.status(201).json(newRating);
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getUserRatings = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const ratings = await Rating.find({ rated: userId })
            .populate('rater', 'name userName profilePicture')
            .populate('item', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Rating.countDocuments({ rated: userId });

        // Get user's current rating stats
        const user = await User.findById(userId).select('rating totalRatings');
        const ratingStats = await Rating.aggregate([
            { $match: { rated: user._id } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                    ratingDistribution: {
                        $push: '$rating'
                    }
                }
            }
        ]);

        res.json({
            ratings,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNext: skip + ratings.length < total,
                hasPrev: parseInt(page) > 1
            },
            stats: ratingStats[0] || {
                averageRating: user.rating,
                totalRatings: user.totalRatings,
                ratingDistribution: []
            }
        });
    } catch (error) {
        console.error('Error getting user ratings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getMyRatings = async (req, res) => {
    try {
        const userId = req.userId;
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const ratings = await Rating.find({ rater: userId })
            .populate('rated', 'name userName profilePicture')
            .populate('item', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Rating.countDocuments({ rater: userId });

        res.json({
            ratings,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNext: skip + ratings.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Error getting my ratings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId;

        const existingRating = await Rating.findById(ratingId);
        if (!existingRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Check if user owns this rating
        if (existingRating.rater.toString() !== userId) {
            return res.status(403).json({ message: 'You can only update your own ratings' });
        }

        // Update rating
        existingRating.rating = rating;
        existingRating.comment = comment;
        await existingRating.save();

        // Update user's average rating
        await updateUserRating(existingRating.rated);

        await existingRating.populate([
            { path: 'rater', select: 'name userName profilePicture' },
            { path: 'rated', select: 'name userName profilePicture' },
            { path: 'item', select: 'title' }
        ]);

        res.json(existingRating);
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const userId = req.userId;

        const existingRating = await Rating.findById(ratingId);
        if (!existingRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Check if user owns this rating
        if (existingRating.rater.toString() !== userId) {
            return res.status(403).json({ message: 'You can only delete your own ratings' });
        }

        const ratedUserId = existingRating.rated;
        await Rating.findByIdAndDelete(ratingId);

        // Update user's average rating
        await updateUserRating(ratedUserId);

        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        console.error('Error deleting rating:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper function to update user's average rating
const updateUserRating = async (userId) => {
    try {
        const stats = await Rating.aggregate([
            { $match: { rated: userId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await User.findByIdAndUpdate(userId, {
                rating: Math.round(stats[0].averageRating * 10) / 10,
                totalRatings: stats[0].totalRatings
            });
        }
    } catch (error) {
        console.error('Error updating user rating:', error);
    }
};
