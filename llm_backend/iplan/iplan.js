const chatWithContext = require('./chat');

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  if (!req.body)
    return res.status(400).send('No request body found');
  const {
    calendar,   // calendar object
    message     // input message from the user
  } = req.body;
  try {
    const result = await chatWithContext.sendMessageStream(
      `The calendar of the user is represented in the following JSON format:\n${JSON.stringify(calendar, null, 2)}\n\nUser's message is:\n${message}`,
    );
    const response = await result.response;
    // console.log("LLM auto_plan: ", JSON.stringify(response, null, 2));

    const data = response.candidates[0].content.parts[0];

    let mReply = data.text;
    const mMethodToCall = data.functionCall;

    if (!mReply && mMethodToCall) {
      // generate a response in case LLM doesn't return a text but wants to call a function
      // tell the model what function we just called
      const functionResponseParts = [
        {
          functionResponse: {
              name: mMethodToCall.name,
              response: {
                  name: mMethodToCall.name,
                  content: { mMethodToCall }
              }
          }
        }
      ];
      // Send a follow up message with a FunctionResponse
      const result2 = await chatWithContext.sendMessage(
        functionResponseParts
      );
      // This should include a text response from the model using the response content
      // provided above
      const response2 = await result2.response;
      mReply = response2.candidates[0].content.parts[0].text;
    }

    console.log("LLM replied: ", mReply);
    console.log("LLM wants to call: ", mMethodToCall);

    res.json({
      mReply,          // text returned by LLM
      mMethodToCall   // method the LLM wants to call, could be undefined if LLM doesn't want to call a function
    });

  } catch (err) {
    console.error("LLM auto_plan error:", err);
    return res.status(500).send('auto_plan failed');
  }
});

module.exports = router;
