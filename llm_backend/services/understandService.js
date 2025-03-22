const model = require('../vertex/gemini');

async function extractStructuredLines(message) {
  const prompt = `
You are an intelligent assistant. Given a paragraph or messy text, extract any task or event descriptions and rewrite them as structured lines.

Use the format:
- For events: Title    Date and time range
- For tasks: Title    Deadline

Example output:
Team Meeting    Mar 23 2 PM to 3 PM
Submit report   Mar 24 11:59 PM

Only return the lines. Do not explain anything.

User message:
${message}
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  return result.response.candidates[0].content.parts[0].text.trim();
}

module.exports = { extractStructuredLines };
