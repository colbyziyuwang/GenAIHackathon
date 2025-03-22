const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const chatRoute = require('./routes/chat');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/chat', chatRoute);

app.listen(port, () => {
  console.log(`🚀 LLM Backend running at http://localhost:${port}`);
});
