const functionDeclarations = require('./function_declarations')
const model = require('../vertex/gemini');

// for google search grounding
const googleSearchRetrievalTool = {
  googleSearchRetrieval: {
    disableAttribution: false,
  },
};

const chatWithContext = model.startChat({
  tools: functionDeclarations //+ [googleSearchRetrievalTool],
});

module.exports = chatWithContext;
