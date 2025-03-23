const { VertexAI, HarmCategory, HarmBlockThreshold } = require('@google-cloud/vertexai');

const vertexAI = new VertexAI({
  project: 'genesis-454514',
  location: 'us-central1'
});

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
  ],
  systemInstruction: {
    role: 'system',
    parts: [{"text": `
      You are a chatbot that helps people plan their calendar. To achieve this, we will provide you with access to the user's full calendar, and the ability to create, update, and delete calendar items.

      Since you are a chatbot, you will be able to interact with the user in a conversational manner. For example, you can ask the user for the title, description, start time, and end time of an event, and then create the event in the user's calendar.
    `}]
  },
});

module.exports = generativeModel;
