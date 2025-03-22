const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const chatRoute = require('./routes/chat');
const planRoute = require('./routes/plan');
const planFromChatRoute = require('./routes/planFromChat');
const understandRoute = require('./routes/understand');
const autoPlanRoute = require('./routes/autoPlan');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/chat', chatRoute);
app.use('/plan', planRoute);
app.use('/plan-from-chat', planFromChatRoute);
app.use('/understand', understandRoute);
app.use('/auto-plan', autoPlanRoute);


app.listen(port, () => {
  console.log(`🚀 LLM Backend running at http://localhost:${port}`);
});
