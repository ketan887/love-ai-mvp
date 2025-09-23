// const mongoose = require("mongoose");

// const ConversationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   title: { type: String, default: "New Conversation" },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Conversation", ConversationSchema);



// // models/Conversation.js
// const mongoose = require("mongoose");

// const conversationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   title: { type: String, default: "Untitled Conversation" },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Conversation", conversationSchema);



// models/Conversation.js
// const mongoose = require("mongoose");

// const conversationSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     title: { type: String, default: "Untitled Conversation" },
//     lastMessage: { type: String, default: "" },
//     lastTime: { type: Date, default: Date.now },
//   },
//   { timestamps: true } // 👈 automatically adds createdAt & updatedAt
// );

// module.exports = mongoose.model("Conversation", conversationSchema);



// models/Conversation.js
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    lastMessage: { type: String, default: "" },
    lastTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
