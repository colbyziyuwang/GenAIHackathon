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

const project = 'genaihackathon-454515';
const location = 'us-central1';
const textModel =  "gemini-1.5-pro";
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
        You are a chatbot that helps people plan their calendar. To achieve this, we will provide you with access to the user's full calendar, and the ability to create, update, and delete **calendar items.

        Since you are a chatbot, you will be able to interact with the user in a conversational manner. For example, you can ask the user for the title, description, start time, and end time of an event, and then create the event in the user's calendar.
      `}]
    },
});

const functionDeclarations = [
  {
    functionDeclarations: [
      {
        name: "createEvent",
        description: "create a new event in the calendar for the user",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            title: {type: FunctionDeclarationSchemaType.STRING},
            description: {type: FunctionDeclarationSchemaType.STRING},
            startTime: {type: FunctionDeclarationSchemaType.STRING},
            endTime: {type: FunctionDeclarationSchemaType.STRING},
            location: {type: FunctionDeclarationSchemaType.STRING},
          },
          required: ['title', 'startTime', 'endTime'],
        },
      },
      {
        name: "updateEvent",
        description: "update an existing event in the calendar for the user",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            eventId: {type: FunctionDeclarationSchemaType.STRING},
            title: {type: FunctionDeclarationSchemaType.STRING},
            description: {type: FunctionDeclarationSchemaType.STRING},
            startTime: {type: FunctionDeclarationSchemaType.STRING},
            endTime: {type: FunctionDeclarationSchemaType.STRING},
            location: {type: FunctionDeclarationSchemaType.STRING},
          },
          required: ['eventId'],
        },
      },
      {
        name: "deleteEvent",
        description: "delete an existing event in the calendar for the user",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            eventId: {type: FunctionDeclarationSchemaType.STRING},
          },
          required: ['eventId'],
        },
      }
    ],
  },
];

const createEvent= (args) => {
  /**
   * Create a new event in the calendar for the user.
   */
  console.log("Creating event with args: ", args);
}

const updateEvent = (args) => {
  /**
   * Update an existing event in the calendar for the user.
   */
  console.log("Updating event with args: ", args);
}

const DeleteEvent = (args) => {
  /**
   * Delete an existing event in the calendar for the user.
   */
  console.log("Deleting event with args: ", args);
}

const chat = generativeModel.startChat({
  tools: functionDeclarations
});

async function sendChat(
  chatInput,
  streamCallback=console.log
) {
  /**
   * Send a chat input to the chatbot and process the response stream.
   * @param {string} chatInput: The chat input to send to the chatbot.
   * @param {function} streamCallback: The callback function to process each stream
   *   item. The default is console.log.
   */
  let res_call = await chat.sendMessageStream(chatInput);
  for await (const item of res_call.stream) {
      // console.log("Stream chunk: ", item.candidates[0].content.parts[0].text);
      streamCallback(item);
  }
  let response = await res_call.response;
  console.log('LLM response: ', prettyFormat(response));

  let data = response.candidates[0].content.parts[0];

  let methodToCall = data.functionCall;
  if (methodToCall == undefined) {  // LLM doesn't want to call a function
    console.log("LLM says without function call: ", data.text);
    return;
  }

  console.log("LLM wants to call: ", methodToCall.name);
  // make the call
  // NOT VALID b/c we don't have backend: make the external call
  // let jsonReturned;
  // try {
  //     const responseFunctionCalling = await axios.get(
  //         baseUrl + "/" + methodToCall.name,
  //         {
  //             params: {
  //                 location: methodToCall.args.location
  //             }
  //         }
  //     );
  //     jsonReturned = responseFunctionCalling.data;
  // } catch (ex) {
  //     // in case an invalid location was provided
  //     jsonReturned = ex.response.data;
  // }
  let jsonReturned = null;
  try {
    let jsonReturned;
    switch (methodToCall.name) {
      case 'createEvent':
        jsonReturned = createEvent(methodToCall.args);
        break;
      case 'updateEvent':
        jsonReturned = updateEvent(methodToCall.args);
        break;
      case 'deleteEvent':
        jsonReturned = deleteEvent(methodToCall.args);
        break;
      default:
        console.log('Unknown function:', methodToCall.name);
        break;
    }
    console.log('Local function returned:', prettyFormat(jsonReturned));
  } catch (ex) {
    console.log('Error calling local function:', ex);
  }

  // tell the model what function we just called
  // so it can generate a response to the user
  let functionResponseParts = [
    {
      functionResponse: {
        name: methodToCall.name,
        response: {
          name: methodToCall.name,
          content: jsonReturned
        }
      }
    }
  ];

  let res_postcall = await chat.sendMessage(functionResponseParts);

  let response2 = await res_postcall.response;
  let answer = response2.candidates[0].content.parts[0].text;

  console.log("LLM responsed: ", answer);
  return answer;
}

// Import the readline module
const readline = require('readline');

// Create an interface for reading input from the terminal
const rl = readline.createInterface({
  input: process.stdin,  // Standard input (terminal)
  output: process.stdout // Standard output (terminal)
});

// Ask the user for input
function promptUser() {
  rl.question("Please enter your prompt: ", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      rl.close();
    } else {
      await sendChat(userInput);
      promptUser();
    }
  });
}

promptUser();
