import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['electronics', 'furniture', 'clothing', 'books', 'home', 'sports', 'toys', 'tools', 'other']
  },
  condition: { 
    type: String, 
    required: true,
    enum: ['excellent', 'good', 'fair', 'poor']
  },
  images: [{ type: String }], // Array of image URLs
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    // GeoJSON point used for geospatial queries
    geo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0]
      }
    }
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['available', 'pending', 'taken', 'expired'],
    default: 'available'
  },
  environmentalImpact: {
    estimatedWeight: { type: Number, default: 1 }, // in kg
    estimatedCo2Saved: { type: Number }, // calculated field
    estimatedWasteDiverted: { type: Number } // calculated field
  },
  type: { 
    type: String, 
    enum: ['giveaway', 'exchange', 'request'],
    default: 'giveaway'
  },
  tags: [{ type: String }], // For better searchability
  environmentalImpact: {
    estimatedWeight: { type: Number, default: 0 }, // in kg
    estimatedCo2Saved: { type: Number, default: 0 }, // in kg
    estimatedWasteDiverted: { type: Number, default: 0 } // in kg
  },
  interestedUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  selectedUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  pickupInstructions: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional expiration date
  isActive: { type: Boolean, default: true }
});

// Index for better search performance
// Use geo field inside location for geospatial index
itemSchema.index({ 'location.geo': '2dsphere' });
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
