

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
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
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






// const dotenv = require("dotenv");
// const Chat = require("../models/Chat");
// const Conversation = require("../models/Conversation");

// dotenv.config();

// const personalities = {
//   romantic: "You are a sweet, loving, emotional relationship advisor ❤️. Guide the user with affectionate suggestions to strengthen love.",
//   flirty: "You are a playful relationship coach 😉. Reply in a teasing, fun way while giving tips to spark attraction.", 
//   funny: "You are a humorous but wise relationship guide 😂. Mix jokes with helpful advice to lighten the mood.",
//   caring: "You are a warm, supportive relationship mentor 🥰. Offer emotional support and thoughtful advice to make their bond stronger.",
// };

// // Groq API function (SUPER FAST!)
// const generateWithGroq = async (prompt) => {
//   try {
//     console.log("⚡ Calling Groq API...");
    
//     const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: "llama3-8b-8192", // Free model - very fast!
//         // Alternative models: "mixtral-8x7b-32768", "gemma-7b-it"
//         messages: [
//           {
//             role: "system",
//             content: "You are a helpful relationship advisor. Keep responses under 100 words, warm, and supportive with appropriate emojis."
//           },
//           {
//             role: "user", 
//             content: prompt
//           }
//         ],
//         max_tokens: 150,
//         temperature: 0.7,
//         top_p: 1,
//         stream: false
//       })
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("❌ Groq API error:", errorText);
//       throw new Error(`Groq API Error: ${response.status}`);
//     }

//     const data = await response.json();
//     const generatedText = data.choices[0].message.content.trim();
    
//     console.log("✅ Groq response received (super fast!)");
//     return generatedText;
    
//   } catch (error) {
//     console.error("❌ Groq generation failed:", error);
//     throw error;
//   }
// };

// // OpenAI-compatible APIs (many free alternatives)
// const generateWithOpenAICompatible = async (prompt) => {
//   const apis = [
//     {
//       name: "Together AI",
//       url: "https://api.together.xyz/v1/chat/completions",
//       model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//       key: process.env.TOGETHER_API_KEY
//     },
//     {
//       name: "Perplexity",  
//       url: "https://api.perplexity.ai/chat/completions",
//       model: "llama-3-sonar-small-32k-chat",
//       key: process.env.PERPLEXITY_API_KEY
//     }
//   ];

//   for (const api of apis) {
//     if (!api.key) continue;
    
//     try {
//       console.log(`🔄 Trying ${api.name}...`);
      
//       const response = await fetch(api.url, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${api.key}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           model: api.model,
//           messages: [
//             {
//               role: "system",
//               content: "You are a helpful relationship advisor. Keep responses under 100 words, warm, and supportive with appropriate emojis."
//             },
//             {
//               role: "user",
//               content: prompt
//             }
//           ],
//           max_tokens: 150,
//           temperature: 0.7
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const text = data.choices[0].message.content.trim();
//         console.log(`✅ ${api.name} success!`);
//         return text;
//       }
//     } catch (error) {
//       console.log(`❌ ${api.name} failed:`, error.message);
//     }
//   }
  
//   throw new Error("All APIs failed");
// };

// const getAIAdvice = async (req, res) => {
//   try {
//     const { message, mode = "romantic", conversationId } = req.body;
    
//     if (!conversationId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "conversationId is required" 
//       });
//     }

//     // Fetch conversation history
//     const historyDocs = await Chat.find({ conversationId, userId: req.userId })
//       .sort({ timestamp: -1 })
//       .limit(5) // Reduced for faster processing
//       .lean();
    
//     const history = historyDocs.reverse();
//     const personality = personalities[mode] || personalities.romantic;
    
//     const context = history
//       .map((h) => h.sender === "user" ? `User: ${h.message}` : `Assistant: ${h.message}`)
//       .join("\n");

//     const prompt = `${personality}

// Recent conversation:
// ${context}

// User just said: "${message}"

// Give supportive relationship advice. Keep it under 100 words, warm, and include relevant emojis.`;

//     let aiReply = "💕 I'm here to help with your relationship! What's on your mind?";

//     try {
//       // Try Groq first (fastest!)
//       if (process.env.GROQ_API_KEY) {
//         aiReply = await generateWithGroq(prompt);
//       }
//       // Try other OpenAI-compatible APIs
//       else {
//         aiReply = await generateWithOpenAICompatible(prompt);
//       }
      
//     } catch (apiError) {
//       console.error("⚠️ All APIs failed, using smart fallback:", apiError.message);
      
//       // Smart fallback based on user message
//       const smartFallbacks = {
//         greetings: ["hi", "hello", "hey", "good morning", "good evening"],
//         problems: ["problem", "issue", "fight", "argue", "angry", "sad", "upset"],
//         advice: ["help", "advice", "what should", "how can", "tips"]
//       };
      
//       const lowerMessage = message.toLowerCase();
      
//       if (smartFallbacks.greetings.some(word => lowerMessage.includes(word))) {
//         aiReply = `Hello! 😊 I'm your ${mode} relationship advisor. What would you like to talk about in your relationship today?`;
//       } else if (smartFallbacks.problems.some(word => lowerMessage.includes(word))) {
//         const responses = {
//           romantic: "💕 Every relationship has challenges. Remember why you fell in love and communicate with kindness.",
//           flirty: "😉 Rough patch? Sometimes a little playfulness and understanding can work wonders!",
//           funny: "😂 Relationships are like comedy shows - timing and delivery matter! Want to talk about it?",
//           caring: "🤗 I hear you're going through something tough. I'm here to listen and support you."
//         };
//         aiReply = responses[mode] || responses.caring;
//       } else {
//         const responses = {
//           romantic: "❤️ Love grows stronger with understanding. What's something beautiful about your relationship?",
//           flirty: "😉 Every relationship needs some spark! What makes you smile about your partner?", 
//           funny: "😄 Love should be fun! What's the silliest thing you and your partner do together?",
//           caring: "💚 I'm here for you. What aspect of your relationship would you like to explore?"
//         };
//         aiReply = responses[mode] || responses.caring;
//       }
//     }

//     // Ensure response isn't too long
//     if (aiReply.length > 200) {
//       aiReply = aiReply.substring(0, 197) + "...";
//     }

//     // Save messages
//     await Chat.create({ conversationId, userId: req.userId, sender: "user", message });
//     await Chat.create({ conversationId, userId: req.userId, sender: "ai", message: aiReply });

//     await Conversation.findByIdAndUpdate(conversationId, {
//       lastMessage: aiReply,
//       lastTime: new Date(),
//     });

//     res.json({ success: true, reply: aiReply });

//   } catch (err) {
//     console.error("❌ AI Service Error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: "AI service failed" 
//     });
//   }
// };

// module.exports = { getAIAdvice };

