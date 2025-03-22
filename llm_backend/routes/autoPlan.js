const express = require('express');
const router = express.Router();
const { autoPlanFromMessage } = require('../services/autoPlanService');

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message.' });
  }

  try {
    const result = await autoPlanFromMessage(message);
    res.json(result);
  } catch (err) {
    console.error("Auto-plan pipeline error:", err);
    res.status(500).json({ error: 'Auto planning failed.' });
  }
});

module.exports = router;
