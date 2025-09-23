// const mongoose = require("mongoose");

// const chatSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   sender: { type: String, enum: ["user", "ai"], required: true },
//   message: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Chat", chatSchema);



// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: String, enum: ["user", "ai"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // ✅ this prevents "Invalid Date"
});

module.exports = mongoose.model("Chat", chatSchema);
