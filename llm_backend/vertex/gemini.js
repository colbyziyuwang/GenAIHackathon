const { VertexAI, HarmCategory, HarmBlockThreshold } = require('@google-cloud/vertexai');

const vertexAI = new VertexAI({
  project: 'genaihackathon-454515',
  location: 'us-central1'
});

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.0-pro',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
  ]
});

module.exports = generativeModel;
