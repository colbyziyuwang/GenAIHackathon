const express = require('express');
const router = express.Router();
const { planPriorSteps } = require('../services/planService');

router.post('/', async (req, res) => {
  const item = req.body;

  // Validate input based on type
  if (
    item.type === 'task' && (!item.title || !item.deadline) ||
    item.type === 'event' && (!item.title || !item.start_time || !item.end_time)
  ) {
    return res.status(400).json({ error: 'Missing required fields for task or event.' });
  }

  try {
    const steps = await planPriorSteps(item);
    res.json({ steps });
  } catch (err) {
    console.error('Planning error:', err);
    res.status(500).json({ error: 'Failed to generate planning steps.' });
  }
});

module.exports = router;
