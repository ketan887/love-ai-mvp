

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const Chat = require("../models/Chat");
const Conversation = require("../models/Conversation");

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const personalities = {
  romantic:
    "You are a sweet, loving, emotional relationship advisor ❤️. Guide the user with affectionate suggestions to strengthen love.",
  flirty:
    "You are a playful relationship coach 😉. Reply in a teasing, fun way while giving tips to spark attraction.",
  funny:
    "You are a humorous but wise relationship guide 😂. Mix jokes with helpful advice to lighten the mood.",
  caring:
    "You are a warm, supportive relationship mentor 🥰. Offer emotional support and thoughtful advice to make their bond stronger.",
};

const getAIAdvice = async (req, res) => {
  try {
    const { message, mode = "romantic", conversationId } = req.body;

    if (!conversationId) {
      return res
        .status(400)
        .json({ success: false, message: "conversationId is required" });
    }

    // Fetch last 10 messages
    const historyDocs = await Chat.find({ conversationId, userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    const history = historyDocs.reverse();
    const personality = personalities[mode] || personalities.romantic;

    const context = history
      .map((h) =>
        h.sender === "user"
          ? `User: ${h.message}`
          : `AI: ${h.message}`
      )
      .join("\n");

    // 📝 Advisor-style prompt
    const prompt = `
You are an AI Relationship Advisor.
${personality}

Conversation so far:
${context}

User just said: "${message}"

👉 Always reply with supportive, actionable relationship advice.
👉 If the user only greets (like "hi" or "hello"), ask something helpful like:
   "What can I do today to make your relationship stronger?".
👉 Keep replies short, warm, and natural. Use emojis to show emotion.
`;

    let aiReply = "I’m here to help 🥰. Tell me one thing you’d like to improve in your relationship.";

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      aiReply = result.response.text().replace(/```[\s\S]*?```/g, "").trim();
    } catch (apiErr) {
      console.error("⚠️ Gemini API failed, using fallback:", apiErr.message);
      aiReply =
        "💡 What can I do today to make your relationship stronger?";
    }

    // ✅ Save messages
    await Chat.create({ conversationId, userId: req.userId, sender: "user", message });
    await Chat.create({ conversationId, userId: req.userId, sender: "ai", message: aiReply });

    // ✅ Update conversation metadata (sidebar display)
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: aiReply,
      lastTime: new Date(),
    });

    res.json({ success: true, reply: aiReply });
  } catch (err) {
    console.error("❌ AI Service Error:", err);
    res.status(500).json({ success: false, message: "AI service failed" });
  }
};

module.exports = { getAIAdvice };
