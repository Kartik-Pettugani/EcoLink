import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  location: {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    }
  },
  environmentalImpact: {
    itemsShared: { type: Number, default: 0 },
    itemsReceived: { type: Number, default: 0 },
    co2Saved: { type: Number, default: 0 }, // in kg
    wasteDiverted: { type: Number, default: 0 } // in kg
  },
  preferences: {
    maxDistance: { type: Number, default: 10 }, // in km
    categories: [{ type: String }], // preferred item categories
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  rating: { type: Number, default: 5.0 },
  totalRatings: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

export default User;
