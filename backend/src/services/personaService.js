export const getPersonaPrompt = (persona) => {
  const personas = {
    teacher: "You are a strict teacher...",
    mentor: "You are a friendly mentor...",
    interviewer: "You are a tough interviewer..."
  };

  return personas[persona] || personas.mentor;
};