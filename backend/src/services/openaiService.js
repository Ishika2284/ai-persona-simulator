import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🎚️ TONE SYSTEM
const getToneInstruction = (tone = 50) => {
  const t = Number(tone);

  if (t < 30) return "Be formal, structured, and precise.";
  if (t < 70) return "Be conversational and clear.";
  return "Be expressive and energetic.";
};

// 🎭 PERSONA SYSTEM
const getPersonaPrompt = (persona, tone) => {
  const base = {
    teacher: "You are a strict computer science teacher.",
    mentor: "You are a friendly mentor.",
    interviewer: "You are a tough interviewer."
  };

  return `
${base[persona] || base.mentor}

${getToneInstruction(tone)}

Stay in character always.
`;
};

// 🧠 TEXT GENERATION
export const generateWithPersona = async (
  question,
  persona,
  tone = 50
) => {
  const systemPrompt = getPersonaPrompt(persona, tone);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question }
    ]
  });

  return {
    text: response.choices[0].message.content,
    persona,
    tone
  };
};

// 🔊 TEXT → SPEECH
export const generateSpeech = async (text) => {
  const mp3 = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "nova",
    input: text
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  const fileName = `speech_${Date.now()}.mp3`;
  const filePath = `./audio/${fileName}`;

  fs.writeFileSync(filePath, buffer);

  return fileName;
};