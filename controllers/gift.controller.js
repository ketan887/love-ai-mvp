
// };



const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getGiftIdeas = async (req, res) => {
  try {
    const { relationship, occasion, budget = "1000", hobbies = "none" } = req.body;

    const prompt = `
Suggest 6 thoughtful, creative gift ideas for a ${relationship} on ${occasion}.
Budget limit: ₹${budget}.
Consider these hobbies/interests: ${hobbies}.

Return ONLY valid JSON in this exact format:
[
  {
    "item": "Gift name",
    "price": "₹range",
    "description": "Why this is a good gift",
    "link": "https://amazon.in/search?q=..."
  }
]
Rules:
- Each gift MUST have: item, price, description, and a valid shopping link (Amazon, Flipkart, or Meesho).
- Do NOT include extra text, explanations, or markdown.
- Keep descriptions short and warm.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    let rawText = result.response.text();
    rawText = rawText.replace(/```json|```/g, "").trim();

    let ideas;
    try {
      ideas = JSON.parse(rawText);
    } catch (err) {
      console.error("⚠️ JSON Parse Error:", err.message, "RAW:", rawText);
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
        raw: rawText,
      });
    }

    res.json({ success: true, data: ideas });
  } catch (err) {
    console.error("❌ Gift API Error:", err.message);
    res.status(500).json({ success: false, message: "Gift API failed" });
  }
};

module.exports = { getGiftIdeas };
