const model = require('../vertex/gemini');

async function planPriorSteps(item) {
  let prompt = '';

  if (item.type === 'task' && item.deadline) {
    prompt = `
You are a task planning assistant. The user has a task: "${item.title}" which is due by ${item.deadline}.
Break this task into 2 to 3 smaller steps that should be completed before the deadline.
Return the steps as a JSON array like:
[
  { "title": "Step name", "due": "ISO 8601 timestamp" }
]
Only output the JSON array. Do not explain anything.
`;
  } else if (item.type === 'event' && item.start_time) {
    prompt = `
You are a task planning assistant. The user has an event: "${item.title}" starting at ${item.start_time}.
Suggest 2 to 3 preparation steps the user should do **before** the event begins.
Each step should have a title and a due time before the event.
Return the steps as a JSON array like:
[
  { "title": "Step name", "due": "ISO 8601 timestamp" }
]
Only output the JSON array. Do not explain anything.
`;
  } else {
    throw new Error('Unsupported item format. Must be task or event with valid time.');
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const reply = result.response.candidates[0].content.parts[0].text;

    let steps = [];
    try {
      const cleaned = reply.trim().replace(/^```json\n?/i, '').replace(/```$/, '');
      steps = JSON.parse(cleaned);
    } catch (err) {
      console.error('⚠️ Failed to parse Gemini JSON:', reply);
    }

    return steps;
  } catch (err) {
    console.error('Gemini error during planning:', err);
    throw err;
  }
}

module.exports = { planPriorSteps };
