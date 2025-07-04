const request = require('supertest');
const express = require('express');
const router = require('../routes/main.routes');

// Mock middlewares and services
jest.mock('../middlewares/auth.middleware', () => jest.fn((req, res, next) => next()));
jest.mock('../services/auth.service');
jest.mock('../services/game.service');
jest.mock('../services/player.service');

const authService = require('../services/auth.service');
const gameService = require('../services/game.service');
const playerService = require('../services/player.service');

const app = express();
app.use(express.json());
app.use(router);

describe('🚦 Orchestrator Routes (main.routes.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Routes', () => {
    it('POST /auth/register should call register()', async () => {
      authService.register.mockImplementation((req, res) => res.json({ msg: 'registered' }));

      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'a', password: '123' });

      expect(authService.register).toHaveBeenCalled();
      expect(res.body.msg).toBe('registered');
    });

    it('POST /auth/login should call login()', async () => {
      authService.login.mockImplementation((req, res) => res.json({ token: '123' }));

      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'a', password: '123' });

      expect(authService.login).toHaveBeenCalled();
      expect(res.body.token).toBe('123');
    });
  });

  describe('Game Routes', () => {
    it('POST /game/start should call startGame()', async () => {
      gameService.startGame.mockImplementation((req, res) => res.json({ started: true }));

      const res = await request(app)
        .post('/game/start')
        .send({ name: 'Player', difficulty: 1 });

      expect(gameService.startGame).toHaveBeenCalled();
      expect(res.body.started).toBe(true);
    });

    it('POST /game/:playerId/submit should call submitAnswer()', async () => {
      gameService.submitAnswer.mockImplementation((req, res) => res.json({ correct: true }));

      const res = await request(app)
        .post('/game/player123/submit')
        .send({ answer: 5 });

      expect(gameService.submitAnswer).toHaveBeenCalled();
      expect(res.body.correct).toBe(true);
    });

    it('PUT /game/:gameId/join should call joinGame()', async () => {
      gameService.joinGame.mockImplementation((req, res) => res.json({ joined: true }));

      const res = await request(app)
        .put('/game/game123/join');

      expect(gameService.joinGame).toHaveBeenCalled();
      expect(res.body.joined).toBe(true);
    });

    it('GET /game/:gameId/end should call endGame()', async () => {
      gameService.endGame.mockImplementation((req, res) => res.json({ ended: true }));

      const res = await request(app)
        .get('/game/game123/end');

      expect(gameService.endGame).toHaveBeenCalled();
      expect(res.body.ended).toBe(true);
    });
  });

  describe('Result Routes', () => {
    it('GET /result/me/:playerId should call getPlayerResult()', async () => {
      playerService.getPlayerResult.mockImplementation((req, res) => res.json({ score: '2/3' }));

      const res = await request(app)
        .get('/result/me/player123');

      expect(playerService.getPlayerResult).toHaveBeenCalled();
      expect(res.body.score).toBe('2/3');
    });

    it('GET /player/all/:gameId should call getGameResult()', async () => {
      playerService.getGameResult.mockImplementation((req, res) => res.json({ winners: ['A'] }));

      const res = await request(app)
        .get('/player/all/game123');

      expect(playerService.getGameResult).toHaveBeenCalled();
      expect(res.body.winners).toContain('A');
    });
  });
});
