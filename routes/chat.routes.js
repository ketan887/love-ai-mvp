// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const { saveMessage, getHistory } = require("../controllers/chat.controller");

// router.post("/save", auth, saveMessage);
// router.get("/history", auth, getHistory);

// module.exports = router;



const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  startConversation,
  getConversations,
  getConversationMessages,
  saveMessage,
  getHistory,
} = require("../controllers/chat.controller");

// Create new conversation
router.post("/start", auth, startConversation);

// Get all conversations
router.get("/conversations", auth, getConversations);  // 👈 keep only this one

// Get all messages from one conversation
router.get("/conversation/:id", auth, getConversationMessages);

// Save a chat message
router.post("/save", auth, saveMessage);

// Optional: legacy chat history
router.get("/history", auth, getHistory);

module.exports = router;
