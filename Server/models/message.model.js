import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  from: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  to: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  roomId: { 
    type: String, 
    required: true,
    index: true
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient queries
messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ from: 1, to: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ to: 1, read: 1 }); // For unread message queries

const Message = mongoose.model("Message", messageSchema);

export default Message;
