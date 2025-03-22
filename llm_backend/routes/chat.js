const express = require('express');
const router = express.Router();
const { handleUserMessage } = require('../services/chatService');

router.post('/', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Missing message in request body.' });
  }

  try {
    console.log(userMessage);
    const reply = await handleUserMessage(userMessage);
    res.json(reply);
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'LLM failed to respond.' });
  }
});

module.exports = router;
