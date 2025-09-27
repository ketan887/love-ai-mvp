const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

// Load .env variables
dotenv.config();

async function testGemini() {
  try {
    console.log("🔹 Checking API key:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Missing");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"  });

    // Test Gemini with a simple message
    const result = await model.generateContent("Hello Gemini, are you working?");
    console.log("✅ Gemini Response:", result.response.text());
  } catch (err) {
    console.error("❌ Gemini API Test Failed:", err.message);
  }
}

testGemini();



// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const dotenv = require("dotenv");

// // Load .env variables
// dotenv.config();

// async function testGrok() {
//   try {
//     console.log(
//       "🔹 Checking API key:",
//       process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Missing"
//     );

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//     // Use Grok model instead of Gemini
//     const model = genAI.getGenerativeModel({ model: "text-bison-001" });

//     // Test Grok with a simple message
//     const result = await model.generateContent("Hello Grok, are you working?");
//     console.log("✅ Grok Response:", result.response.text());
//   } catch (err) {
//     console.error("❌ Grok API Test Failed:", err.message);
//   }
// }

// testGrok();
