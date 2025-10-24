import User from '../models/user.model.js';
import Item from '../models/item.model.js';
import Message from '../models/message.model.js';

// Get user stats for dashboard
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get items shared by user
    const sharedItems = await Item.find({ owner: userId });
    const itemsShared = sharedItems.length;

    // Get items received by user (where user is in interestedUsers and status is 'taken')
    const receivedItems = await Item.find({
      interestedUsers: userId,
      status: 'taken'
    });
    const itemsReceived = receivedItems.length;

    // Calculate total transactions
    const totalTransactions = itemsShared + itemsReceived;

    // Calculate total waste and CO2 saved
    const allItems = [...sharedItems, ...receivedItems];
    const wasteSaved = allItems.reduce((total, item) => {
      const weight = item.environmentalImpact?.estimatedWeight || 1; // Default to 1kg if not specified
      // Update the item's environmental impact if not already set
      if (!item.environmentalImpact?.estimatedCo2Saved) {
        item.environmentalImpact = {
          ...item.environmentalImpact,
          estimatedWeight: weight,
          estimatedCo2Saved: weight * 2.5, // Average CO2 savings per kg
          estimatedWasteDiverted: weight
        };
        item.save();
      }
      return total + weight;
    }, 0);

    // Get recent activity
    const recentItems = await Item.find({
      $or: [
        { owner: userId },
        { interestedUsers: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('owner', 'name userName');

    const recentActivity = recentItems.map(item => ({
      title: item.owner._id.toString() === userId.toString() 
        ? `You listed "${item.title}"`
        : `You expressed interest in "${item.title}"`,
      date: item.createdAt,
      itemId: item._id
    }));

    // Get recent messages
    const recentMessages = await Message.find({
      $or: [
        { from: userId },
        { to: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('from to', 'name userName');

    // Add message activities
    recentMessages.forEach(msg => {
      recentActivity.push({
        title: msg.from._id.toString() === userId.toString()
          ? `You sent a message to ${msg.to.name}`
          : `You received a message from ${msg.from.name}`,
        date: msg.createdAt
      });
    });

    // Sort all activities by date
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      itemsShared,
      itemsReceived,
      totalTransactions,
      wasteSaved,
      recentActivity: recentActivity.slice(0, 10) // Only return most recent 10 activities
    });

  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};