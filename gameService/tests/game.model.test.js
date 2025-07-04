const mongoose = require('mongoose');
const Game = require('../models/game.model');

describe('🧩 Game Model', () => {
  it('should fail without difficulty', async () => {
    const game = new Game({});
    try {
      await game.validate();
    } catch (err) {
      expect(err.errors.difficulty).toBeDefined();
    }
  });

  it('should save with valid difficulty', async () => {
    const game = new Game({
      difficulty: 1,
      questions: [{ question: '1+2', answer: 3 }]
    });
    await expect(game.validate()).resolves.toBeUndefined();
  });
});
