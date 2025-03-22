/**
 * This is a starter demonstration of how to connect to the Google Cloud Vertex
 * AI API and do some text-based interactions.
 */

const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');

const {format: prettyFormat} = require('pretty-format');

const project = 'genesis-454514';
const location = 'us-central1';
const textModel =  'gemini-1.5-pro';
const visionModel = 'gemini-1.5-pro-vision';

const vertexAI = new VertexAI({project: project, location: location});

// Instantiate Gemini models
const generativeModel = vertexAI.getGenerativeModel({
    model: textModel,
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safetySettings: [{
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }],
    generationConfig: {maxOutputTokens: 256},
    systemInstruction: {
      role: 'system',
      parts: [{"text": `
        You are a chatbot that helps people plan their day.
      `}]
    },
});

const generativeVisionModel = vertexAI.getGenerativeModel({
  model: visionModel,
});

const generativeModelPreview = vertexAI.preview.getGenerativeModel({
  model: textModel,
});

const functionDeclarations = [
  {
    functionDeclarations: [
      {
        name: "get_current_weather",
        description: 'get weather in a given location',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            location: {type: FunctionDeclarationSchemaType.STRING},
            unit: {
              type: FunctionDeclarationSchemaType.STRING,
              enum: ['celsius', 'fahrenheit'],
            },
          },
          required: ['location'],
        },
      },
    ],
  },
];

const functionResponseParts = [
  {
    functionResponse: {
      name: "get_current_weather",
      response:
          {name: "get_current_weather", content: {weather: "super nice"}},
    },
  },
];

async function functionCallingChat() {
  // Create a chat session and pass your function declarations
  const chat = generativeModel.startChat({
    tools: functionDeclarations,
  });

  const chatInput1 = 'What is the weather in Boston?';

  // This should include a functionCall response from the model
  const streamingResult1 = await chat.sendMessageStream(chatInput1);
  for await (const item of streamingResult1.stream) {
    console.log(item.candidates[0]);
  }
  const response1 = await streamingResult1.response;
  console.log("first aggregated response: ", prettyFormat(response1));

  // Send a follow up message with a FunctionResponse
  const streamingResult2 = await chat.sendMessageStream(functionResponseParts);
  for await (const item of streamingResult2.stream) {
    console.log(item.candidates[0]);
  }

  // This should include a text response from the model using the response content
  // provided above
  const response2 = await streamingResult2.response;
  console.log("second aggregated response: ", prettyFormat(response2));
}

functionCallingChat();


