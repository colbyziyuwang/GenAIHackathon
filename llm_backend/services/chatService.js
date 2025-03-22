const model = require('../vertex/gemini');

async function handleUserMessage(userInput) {
  // Combine instructions + user message into a single user prompt
  const fullPrompt = `
You are a helpful assistant that normalizes scheduling input.

Each line is either an event or a task:
- Events always include a start and end time.
- Tasks always include a deadline.

Your job is to return a structured JSON array of objects like this:
[
  {
    "type": "event",
    "title": "Team Meeting",
    "start_time": "2025-03-23T14:00:00Z",
    "end_time": "2025-03-23T15:00:00Z"
  },
  {
    "type": "task",
    "title": "Submit report",
    "deadline": "2025-03-24T23:59:00Z"
  }
]

Only return the JSON array. Do not include any explanation or comments.

User input:
${userInput}
  `;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: fullPrompt }]
        }
      ]
    });

    const replyText = result.response.candidates[0].content.parts[0].text;

    // Try to parse the output as JSON
    let items = [];
    try {
      items = JSON.parse(replyText);
    } catch (err) {
      console.error("⚠️ Failed to parse Gemini output as JSON:", replyText);
    }

    return {
      reply: `Normalized ${items.length} item(s).`,
      items
    };
  } catch (err) {
    console.error("Gemini error:", err);
    throw err; // this will get caught by routes/chat.js
  }
}

module.exports = { handleUserMessage };
