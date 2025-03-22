const { extractStructuredLines } = require('./understandService');
const { handleUserMessage } = require('./chatService');
const { planPriorSteps } = require('./planService');

async function autoPlanFromMessage(message) {
  // Step 1: Convert raw input to structured lines
  const lines = await extractStructuredLines(message);

  // Step 2: Normalize to structured items (task/event objects)
  const { items } = await handleUserMessage(lines);

  // Step 3: Generate planning steps for each item
  const plans = [];
  for (const item of items) {
    const steps = await planPriorSteps(item);
    plans.push({ item, steps });
  }

  return {
    reply: `Planned ${plans.length} item(s).`,
    parsed_lines: lines,
    plans
  };
}

module.exports = { autoPlanFromMessage };
