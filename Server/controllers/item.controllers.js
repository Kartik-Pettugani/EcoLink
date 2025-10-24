import Item from "../models/item.model.js";
import User from "../models/user.model.js";
import { notifyUser } from "../services/socket.js";

export const createItem = async (req, res) => {
    const userId = req.userId;
    const itemData = req.body;
    
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
        // Get user location for the item if not provided
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Use user's location if item location not provided
        if (!itemData.location && user.location) {
            itemData.location = user.location;
        }
        
        // Add owner to the item
        itemData.owner = userId;
        
        // Handle images - convert to array if string
        if (itemData.images) {
            if (typeof itemData.images === 'string') {
                try {
                    itemData.images = JSON.parse(itemData.images);
                } catch (e) {
                    itemData.images = [itemData.images];
                }
            }
            // Ensure images is an array
            if (!Array.isArray(itemData.images)) {
                itemData.images = [];
            }
        } else {
            itemData.images = [];
        }

        // Calculate environmental impact based on category and condition
        try {
            const impact = calculateEnvironmentalImpact(itemData.category, itemData.condition, itemData.environmentalImpact?.estimatedWeight);
            itemData.environmentalImpact = impact;
        } catch (impErr) {
            console.warn('Error calculating environmental impact:', impErr);
            // continue without impact
            itemData.environmentalImpact = itemData.environmentalImpact || {};
        }

        // Log incoming item data for debugging (trim large payloads)
        try {
            const preview = JSON.stringify(itemData).slice(0, 2000);
            console.log('Creating item with data (preview):', preview);
        } catch (logErr) {
            console.log('Creating item - unable to stringify itemData');
        }
        // Ensure geo coordinates are set for geospatial index: [lng, lat]
        if (itemData.location && itemData.location.coordinates) {
            const lat = parseFloat(itemData.location.coordinates.lat) || 0;
            const lng = parseFloat(itemData.location.coordinates.lng) || 0;
            itemData.location.geo = {
                type: 'Point',
                coordinates: [lng, lat]
            };
        }
        
    const newItem = await Item.create(itemData);
        
        // Populate owner details
        await newItem.populate('owner', 'name userName profilePicture rating');
        
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item:", error);
        console.error(error.stack);
        // If Mongoose validation error, return details to help client debug
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).reduce((acc, key) => {
                acc[key] = error.errors[key].message;
                return acc;
            }, {});
            return res.status(400).json({ message: 'Validation Error', errors });
        }
        return res.status(500).json({ message: "Server Error", detail: error.message });
    }
};

export const getItems = async (req, res) => {
    try {
        const { 
            category, 
            status = 'available', 
            type, 
            city, 
            state, 
            lat, 
            lng, 
            radius = 10, // in km
            page = 1, 
            limit = 20,
            search,
            condition,
            minWeight,
            maxWeight,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            dateFrom,
            dateTo
        } = req.query;
        
        let query = { isActive: true };
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Filter by type
        if (type) {
            query.type = type;
        }
        
        // Filter by location
        if (city) {
            query['location.city'] = new RegExp(city, 'i');
        }
        if (state) {
            query['location.state'] = new RegExp(state, 'i');
        }
        
        // Filter by condition
        if (condition) {
            query.condition = condition;
        }
        
        // Filter by weight range
        if (minWeight || maxWeight) {
            query['environmentalImpact.estimatedWeight'] = {};
            if (minWeight) {
                query['environmentalImpact.estimatedWeight'].$gte = parseFloat(minWeight);
            }
            if (maxWeight) {
                query['environmentalImpact.estimatedWeight'].$lte = parseFloat(maxWeight);
            }
        }
        
        // Filter by date range
        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) {
                query.createdAt.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                query.createdAt.$lte = new Date(dateTo);
            }
        }
        
        // Filter by search term (enhanced)
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } },
                { 'owner.name': searchRegex },
                { 'owner.userName': searchRegex }
            ];
        }
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        let items;
        
        // If lat/lng provided, use geospatial query
        if (lat && lng) {
            const coordinates = [parseFloat(lng), parseFloat(lat)];
            const maxDistance = parseFloat(radius) * 1000; // Convert km to meters

            items = await Item.find({
                ...query,
                'location.geo': {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: coordinates
                        },
                        $maxDistance: maxDistance
                    }
                }
            })
            .populate('owner', 'name userName profilePicture rating')
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));
        } else {
            items = await Item.find(query)
                .populate('owner', 'name userName profilePicture rating')
                .sort(sortObj)
                .skip(skip)
                .limit(parseInt(limit));
        }
        
        // Get total count for pagination
        const total = await Item.countDocuments(query);
        
        res.json({
            items,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNext: skip + items.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error("Error getting items:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const item = await Item.findById(id)
            .populate('owner', 'name userName profilePicture rating totalRatings')
            .populate('interestedUsers', 'name userName profilePicture')
            .populate('selectedUser', 'name userName profilePicture');
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        res.json(item);
    } catch (error) {
        console.error("Error getting item:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const updateItem = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const updateData = req.body;
    
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
        const item = await Item.findById(id);
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Check if user is the owner
        if (item.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to update this item" });
        }
        
        // Remove fields that shouldn't be updated directly
        delete updateData.owner;
        delete updateData.createdAt;
        
        // Recalculate environmental impact if category or condition changed
        if (updateData.category || updateData.condition) {
            const impact = calculateEnvironmentalImpact(
                updateData.category || item.category,
                updateData.condition || item.condition,
                updateData.environmentalImpact?.estimatedWeight || item.environmentalImpact?.estimatedWeight
            );
            updateData.environmentalImpact = impact;
        }
        
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('owner', 'name userName profilePicture rating');
        
        res.json(updatedItem);
    } catch (error) {
        console.error("Error updating item:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const deleteItem = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
        const item = await Item.findById(id);
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Check if user is the owner
        if (item.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this item" });
        }
        
        // Soft delete by setting isActive to false
        await Item.findByIdAndUpdate(id, { isActive: false });
        
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const expressInterest = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
        const item = await Item.findById(id);
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Check if user is not the owner
        if (item.owner.toString() === userId) {
            return res.status(400).json({ message: "Cannot express interest in your own item" });
        }
        
        // Check if item is still available
        if (item.status !== 'available') {
            return res.status(400).json({ message: "Item is no longer available" });
        }
        
        // Add user to interested users if not already there
        if (!item.interestedUsers.includes(userId)) {
            item.interestedUsers.push(userId);
            await item.save();
            try {
                // Fetch interested user's basic info to include in payload
                const interested = await User.findById(userId).select('name userName profilePicture');
                const payload = {
                    itemId: item._id,
                    itemTitle: item.title,
                    interestedUser: interested ? { _id: interested._id, name: interested.name, userName: interested.userName, profilePicture: interested.profilePicture } : { _id: userId },
                    message: `${interested ? interested.name : 'A user'} expressed interest in your item.`
                };
                notifyUser(item.owner.toString(), 'interest:notification', payload);
            } catch (e) {
                console.warn('Failed to emit interest notification', e);
            }
        }
        
        const updatedItem = await Item.findById(id)
            .populate('owner', 'name userName profilePicture rating')
            .populate('interestedUsers', 'name userName profilePicture');
        
        res.json(updatedItem);
    } catch (error) {
        console.error("Error expressing interest:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getUserItems = async (req, res) => {
    const userId = req.userId;
    
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
        const { status, type } = req.query;
        
        let query = { owner: userId, isActive: true };
        
        if (status) {
            query.status = status;
        }
        
        if (type) {
            query.type = type;
        }
        
        const items = await Item.find(query)
            .populate('interestedUsers', 'name userName profilePicture')
            .populate('selectedUser', 'name userName profilePicture')
            .sort({ createdAt: -1 });
        
        res.json(items);
    } catch (error) {
        console.error("Error getting user items:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Helper function to calculate environmental impact
function calculateEnvironmentalImpact(category, condition, weight = 1) {
    // Base CO2 savings per kg by category (in kg CO2)
    const co2Factors = {
        electronics: 15,
        furniture: 8,
        clothing: 12,
        books: 3,
        home: 5,
        sports: 6,
        toys: 4,
        tools: 10,
        other: 5
    };
    
    // Condition multipliers
    const conditionMultipliers = {
        excellent: 1.0,
        good: 0.8,
        fair: 0.6,
        poor: 0.4
    };
    
    const baseCo2 = co2Factors[category] || 5;
    const conditionMultiplier = conditionMultipliers[condition] || 0.6;
    
    const estimatedCo2Saved = baseCo2 * weight * conditionMultiplier;
    const estimatedWasteDiverted = weight * conditionMultiplier;
    
    return {
        estimatedWeight: weight,
        estimatedCo2Saved: Math.round(estimatedCo2Saved * 100) / 100,
        estimatedWasteDiverted: Math.round(estimatedWasteDiverted * 100) / 100
    };
}

export const searchItems = async (req, res) => {
    try {
        const { 
            q, // main search query
            filters = {},
            sort = { field: 'createdAt', order: 'desc' },
            page = 1,
            limit = 20
        } = req.body;
        
        let query = { isActive: true };
        
        // Main search query
        if (q) {
            const searchRegex = new RegExp(q, 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } },
                { 'owner.name': searchRegex },
                { 'owner.userName': searchRegex }
            ];
        }
        
        // Apply filters
        if (filters.category) {
            query.category = filters.category;
        }
        if (filters.condition) {
            query.condition = filters.condition;
        }
        if (filters.type) {
            query.type = filters.type;
        }
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.location) {
            if (filters.location.city) {
                query['location.city'] = new RegExp(filters.location.city, 'i');
            }
            if (filters.location.state) {
                query['location.state'] = new RegExp(filters.location.state, 'i');
            }
        }
        if (filters.weightRange) {
            query['environmentalImpact.estimatedWeight'] = {};
            if (filters.weightRange.min) {
                query['environmentalImpact.estimatedWeight'].$gte = parseFloat(filters.weightRange.min);
            }
            if (filters.weightRange.max) {
                query['environmentalImpact.estimatedWeight'].$lte = parseFloat(filters.weightRange.max);
            }
        }
        if (filters.dateRange) {
            query.createdAt = {};
            if (filters.dateRange.from) {
                query.createdAt.$gte = new Date(filters.dateRange.from);
            }
            if (filters.dateRange.to) {
                query.createdAt.$lte = new Date(filters.dateRange.to);
            }
        }
        
        // Geospatial search
        if (filters.nearby && filters.nearby.lat && filters.nearby.lng) {
            const coordinates = [parseFloat(filters.nearby.lng), parseFloat(filters.nearby.lat)];
            const maxDistance = (filters.nearby.radius || 10) * 1000; // Convert km to meters
            
            query['location.geo'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    $maxDistance: maxDistance
                }
            };
        }
        
        // Build sort object
        const sortObj = {};
        sortObj[sort.field] = sort.order === 'desc' ? -1 : 1;
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Execute query
        const items = await Item.find(query)
            .populate('owner', 'name userName profilePicture rating')
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));
        
        // Get total count
        const total = await Item.countDocuments(query);
        
        // Get aggregation data for filters
        const aggregationData = await Item.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    categories: { $addToSet: '$category' },
                    conditions: { $addToSet: '$condition' },
                    types: { $addToSet: '$type' },
                    cities: { $addToSet: '$location.city' },
                    states: { $addToSet: '$location.state' },
                    minWeight: { $min: '$environmentalImpact.estimatedWeight' },
                    maxWeight: { $max: '$environmentalImpact.estimatedWeight' }
                }
            }
        ]);
        
        res.json({
            items,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNext: skip + items.length < total,
                hasPrev: parseInt(page) > 1
            },
            filters: aggregationData[0] || {
                categories: [],
                conditions: [],
                types: [],
                cities: [],
                states: [],
                minWeight: 0,
                maxWeight: 0
            }
        });
    } catch (error) {
        console.error("Error in advanced search:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
