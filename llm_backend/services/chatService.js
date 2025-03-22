const model = require('../vertex/gemini');

async function handleUserMessage(message) {
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: message }] }]
  });

  const text = result.response.candidates[0].content.parts[0].text;

  // In future: run intent extraction, save to DB, etc.
  return {
    reply: text
  };
}

module.exports = { handleUserMessage };
