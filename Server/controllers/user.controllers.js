import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    const userId = req.userId;
    if(!userId){
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const verifiedUser = await User.findById(userId).select('-password');
        res.json(verifiedUser);
    }catch(error){
        return res.status(500).json({message:"Server Error"});
    }
}

export const updateProfile = async (req, res) => {
    const userId = req.userId;
    const updateData = req.body;
    
    if(!userId){
        return res.status(401).json({message:"Unauthorized"});
    }
    
    try{
        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.password;
        delete updateData.email;
        delete updateData.userName;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json(updatedUser);
    }catch(error){
        console.error("Error updating profile:", error);
        return res.status(500).json({message:"Server Error"});
    }
}

export const updateLocation = async (req, res) => {
    const userId = req.userId;
    const { address, city, state, zipCode, coordinates } = req.body;
    
    if(!userId){
        return res.status(401).json({message:"Unauthorized"});
    }
    
    try{
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                location: {
                    address: address || '',
                    city: city || '',
                    state: state || '',
                    zipCode: zipCode || '',
                    coordinates: coordinates || { lat: 0, lng: 0 }
                }
            },
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json(updatedUser);
    }catch(error){
        console.error("Error updating location:", error);
        return res.status(500).json({message:"Server Error"});
    }
}

export const updateEnvironmentalImpact = async (req, res) => {
    const userId = req.userId;
    const { itemsShared, itemsReceived, co2Saved, wasteDiverted } = req.body;
    
    if(!userId){
        return res.status(401).json({message:"Unauthorized"});
    }
    
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        
        // Update environmental impact metrics
        user.environmentalImpact.itemsShared += itemsShared || 0;
        user.environmentalImpact.itemsReceived += itemsReceived || 0;
        user.environmentalImpact.co2Saved += co2Saved || 0;
        user.environmentalImpact.wasteDiverted += wasteDiverted || 0;
        
        await user.save();
        
        const updatedUser = await User.findById(userId).select('-password');
        res.json(updatedUser);
    }catch(error){
        console.error("Error updating environmental impact:", error);
        return res.status(500).json({message:"Server Error"});
    }
}

export const getUserStats = async (req, res) => {
    const userId = req.userId;
    
    if(!userId){
        return res.status(401).json({message:"Unauthorized"});
    }
    
    try{
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        
        const stats = {
            environmentalImpact: user.environmentalImpact,
            rating: user.rating,
            totalRatings: user.totalRatings,
            joinedAt: user.joinedAt,
            lastActive: user.lastActive
        };
        
        res.json(stats);
    }catch(error){
        console.error("Error getting user stats:", error);
        return res.status(500).json({message:"Server Error"});
    }
}