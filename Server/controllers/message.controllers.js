import Message from '../models/message.model.js';
import User from '../models/user.model.js';

// Get conversation with a specific user
export const getConversationWith = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;

        if (!userId || !currentUserId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Create room ID for the conversation
        const roomId = `room:${[currentUserId, userId].sort().join(':')}`;

        // Get messages between the two users
        const messages = await Message.find({ roomId })
            .populate('from', 'name userName profilePicture')
            .populate('to', 'name userName profilePicture')
            .sort({ createdAt: 1 });

        res.json({ messages });
    } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { to, text } = req.body;
        const from = req.userId;

        if (!to || !text || !from) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate that the recipient exists
        const recipient = await User.findById(to);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // Create room ID
        const roomId = `room:${[from, to].sort().join(':')}`;

        // Create and save the message
        const message = new Message({
            from,
            to,
            text: text.trim(),
            roomId
        });

        await message.save();
        await message.populate('from', 'name userName profilePicture');
        await message.populate('to', 'name userName profilePicture');

        res.status(201).json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all conversations for the current user
export const getConversations = async (req, res) => {
    try {
        const currentUserId = req.userId;

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Get all unique room IDs where the current user is involved
        const messages = await Message.find({
            $or: [
                { from: currentUserId },
                { to: currentUserId }
            ]
        })
        .populate('from', 'name userName profilePicture')
        .populate('to', 'name userName profilePicture')
        .sort({ createdAt: -1 });

        // Group messages by room and get the latest message for each conversation
        const conversations = {};
        messages.forEach(message => {
            const roomId = message.roomId;
            if (!conversations[roomId] || message.createdAt > conversations[roomId].lastMessage.createdAt) {
                const otherUser = message.from._id.toString() === currentUserId ? message.to : message.from;
                conversations[roomId] = {
                    roomId,
                    otherUser,
                    lastMessage: message,
                    unreadCount: 0 // You can implement unread count logic here
                };
            }
        });

        const conversationList = Object.values(conversations);
        res.json({ conversations: conversationList });
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.userId;

        if (!otherUserId || !currentUserId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const roomId = `room:${[currentUserId, otherUserId].sort().join(':')}`;

        // Mark all messages in this conversation as read
        await Message.updateMany(
            { 
                roomId, 
                to: currentUserId,
                read: false 
            },
            { read: true }
        );

        res.json({ message: "Messages marked as read" });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: "Server Error" });
    }
};
