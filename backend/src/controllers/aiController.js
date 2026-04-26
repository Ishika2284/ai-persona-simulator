import {
  generateWithPersona,
  generateSpeech
} from "../services/openaiService.js";

export const generateResponse = async (req, res) => {
  const { question, persona, tone } = req.body;

  const result = await generateWithPersona(question, persona, tone);

  const audioFile = await generateSpeech(result.text);

  res.json({
    text: result.text,
    audioUrl: `http://localhost:5000/audio/${audioFile}`
  });
};