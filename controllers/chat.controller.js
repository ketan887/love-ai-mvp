// const Chat = require("../models/Chat");

// // Save a chat message
// exports.saveMessage = async (req, res) => {
//   try {
//     const { sender, message } = req.body;
//     const chat = await Chat.create({
//       userId: req.userId,
//       sender,
//       message,
//       timestamp: new Date(),
//     });
//     res.json({ success: true, data: chat });
//   } catch (err) {
//     console.error("❌ Save Chat Error:", err);
//     res.status(500).json({ success: false, message: "Failed to save chat" });
//   }
// };

// // Get chat history
// exports.getHistory = async (req, res) => {
//   try {
//     const history = await Chat.find({ userId: req.userId })
//       .sort({ timestamp: -1 })
//       .limit(50); // optional limit
//     res.json({ success: true, data: history });
//   } catch (err) {
//     console.error("❌ Get Chat History Error:", err);
//     res.status(500).json({ success: false, message: "Failed to load chat history" });
//   }
// };




const Chat = require("../models/Chat");
const Conversation = require("../models/Conversation");

// 📌 Start new conversation
// exports.startConversation = async (req, res) => {
//   try {
//     console.log("req.userId:", req.userId);
//     console.log("req.body:", req.body);

//     const { title } = req.body || {};

//     const conversation = new Conversation({
//       userId: req.userId,
//       title: title || "Untitled Conversation",
//     });

//     await conversation.save();
//     res.json({ success: true, conversation });
//   } catch (err) {
//     console.error("❌ Start Conversation Error:", err);
//     res.status(500).json({ success: false, message: "Error starting conversation" });
//   }
// };



// 📌 Start a new conversation
exports.startConversation = async (req, res) => {
  try {
    const { title } = req.body;

    const conversation = await Conversation.create({
      userId: req.userId,    // 🔑 link to logged-in user
      title,
      lastMessage: "",
      lastTime: new Date(),
    });

    res.status(201).json({ conversation });
  } catch (err) {
    console.error("❌ Start Conversation Error:", err);
    res.status(500).json({ success: false, message: "Failed to start conversation" });
  }
};





// 📌 Get all conversations of a user
// exports.getConversations = async (req, res) => {
//   try {
//     const conversations = await Conversation.find({ userId: req.userId })
//       .sort({ createdAt: -1 });
//     res.json({ success: true, data: conversations });
//   } catch (err) {
//     console.error("❌ Get Conversations Error:", err);
//     res.status(500).json({ success: false, message: "Failed to fetch conversations" });
//   }
// };



// 📌 Get all conversations for logged-in user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.userId })
      .sort({ updatedAt: -1 }); // newest first
    res.json({ conversations });
  } catch (err) {
    console.error("❌ Get Conversations Error:", err);
    res.status(500).json({ success: false, message: "Failed to load conversations" });
  }
};


// 📌 Get messages of a single conversation
// exports.getConversationMessages = async (req, res) => {
//   try {
//     const messages = await Chat.find({
//       conversationId: req.params.id,
//       userId: req.userId,
//     }).sort({ timestamp: 1 });
//     res.json({ success: true, data: messages });
//   } catch (err) {
//     console.error("❌ Get Conversation Messages Error:", err);
//     res.status(500).json({ success: false, message: "Failed to fetch messages" });
//   }
// };


// exports.getConversationMessages = async (req, res) => {
//   try {
//     const messages = await Message.find({
//       conversation: req.params.id,
//       user: req.userId, // 👈 only this user's messages
//     }).sort({ createdAt: 1 });
//     res.json({ messages });
//   } catch (e) {
//     res.status(500).json({ message: "Error fetching messages", error: e.message });
//   }
// };


// 📌 Get all messages of one conversation
exports.getConversationMessages = async (req, res) => {
  try {
    const messages = await Chat.find({
      conversationId: req.params.id,
      userId: req.userId,  // ✅ match field from saveMessage
    }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (e) {
    console.error("❌ Get Conversation Messages Error:", e);
    res.status(500).json({ message: "Error fetching messages", error: e.message });
  }
};


// 📌 Save message inside conversation
// chat.controller.js -> saveMessage
exports.saveMessage = async (req, res) => {
  try {
    const { conversationId, sender, message } = req.body;

    const chat = await Chat.create({
      conversationId,
      userId: req.userId,
      sender,
      message,
    });

    // 🔥 update conversation's last message + lastTime
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      lastTime: new Date(),
    });

    res.json({ success: true, data: chat });
  } catch (err) {
    console.error("❌ Save Chat Error:", err);
    res.status(500).json({ success: false, message: "Failed to save chat" });
  }
};



// 📌 Legacy: get recent chat history (without conversation grouping)
exports.getHistory = async (req, res) => {
  try {
    const history = await Chat.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json({ success: true, data: history });
  } catch (err) {
    console.error("❌ Get Chat History Error:", err);
    res.status(500).json({ success: false, message: "Failed to load chat history" });
  }
};
