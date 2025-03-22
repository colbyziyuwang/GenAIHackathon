const express = require('express');
const router = express.Router();
const { extractStructuredLines } = require('../services/understandService');

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message.' });
  }

  try {
    const lines = await extractStructuredLines(message);
    res.json({ lines });
  } catch (err) {
    console.error("Understand error:", err);
    res.status(500).json({ error: 'Failed to interpret message.' });
  }
});

module.exports = router;
