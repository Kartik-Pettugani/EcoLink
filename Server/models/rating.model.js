import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  transactionType: {
    type: String,
    enum: ['gave', 'received', 'exchanged'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one rating per user per item
ratingSchema.index({ rater: 1, item: 1 }, { unique: true });

// Index for efficient queries
ratingSchema.index({ rated: 1, createdAt: -1 });
ratingSchema.index({ rater: 1, createdAt: -1 });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
