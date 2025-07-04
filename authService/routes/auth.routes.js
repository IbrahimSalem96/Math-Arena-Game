const express = require('express');
const router = express.Router();
const { register, login } = require('../services/auth.service');

router.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const result = await register(name, username, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await login(username, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
