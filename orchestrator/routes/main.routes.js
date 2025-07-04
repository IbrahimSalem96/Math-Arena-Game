const express = require('express');
const router = express.Router();
const { register, login } = require('../services/auth.service');
const { startGame, submitAnswer, joinGame, endGame } = require('../services/game.service');
const verifyToken = require('../middlewares/auth.middleware');
const { getPlayerResult, getGameResult } = require('../services/player.service');

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Game routes
router.post('/game/start', verifyToken, startGame);
router.post('/game/:playerId/submit', verifyToken, submitAnswer); 
router.put('/game/:gameId/join', verifyToken, joinGame);
router.get('/game/:gameId/end', verifyToken, endGame);

// Get Result
router.get('/result/me/:playerId', verifyToken, getPlayerResult);
router.get('/player/all/:gameId', verifyToken, getGameResult);

module.exports = router;
