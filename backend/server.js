const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

console.log("🚀 GenAI Backend Running (Ollama)");

// 🧠 CALL LOCAL LLM (SAFE)
async function callLLM(prompt) {
  try {
    console.log("Sending prompt to Ollama...");

    const res = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false
    });

    console.log("OLLAMA RESPONSE RECEIVED");

    return res.data.response;
  } catch (err) {
    console.error("OLLAMA ERROR:", err.message);

    return "❌ Ollama not running OR model not loaded";
  }
}

// 🎭 PERSONA PROMPTS
function buildPrompt(persona, custom, message) {
  let style = "";

  if (persona === "teacher") {
    style = "You are a strict but helpful teacher. Explain clearly.";
  } else if (persona === "mentor") {
    style = "You are a friendly mentor. Give simple guidance.";
  } else if (persona === "interviewer") {
    style = "You are a technical interviewer. Be precise and strict.";
  } else if (persona === "custom") {
    style = `You are acting as: ${custom}. Stay fully in character.`;
  } else {
    style = "You are a helpful AI assistant.";
  }

  return `
${style}

User Question:
${message}

Answer clearly and concisely.
`;
}

// 🚀 MAIN API
app.post("/chat", async (req, res) => {
  try {
    const { message, persona, customPersona } = req.body;

    console.log("REQUEST:", req.body);

    if (!message) {
      return res.json({ response: "No message provided" });
    }

    const prompt = buildPrompt(persona, customPersona, message);

    const response = await callLLM(prompt);

    return res.json({ response });

  } catch (err) {
    console.error("SERVER ERROR:", err.message);
    return res.json({ response: "Server error occurred" });
  }
});

// 🏠 TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 GenAI Backend Working");
});

// 🚀 START SERVER
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});