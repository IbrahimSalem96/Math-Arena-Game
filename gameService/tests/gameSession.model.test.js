const GameSession = require('../models/gameSession.model');

describe('📆 GameSession Model', () => {
  it('should require difficulty', async () => {
    const session = new GameSession({});
    try {
      await session.validate();
    } catch (err) {
      expect(err.errors.difficulty).toBeDefined();
    }
  });

  it('should save with valid data', async () => {
    const session = new GameSession({
      difficulty: 2,
      questions: [{ question: '2+2', correctAnswer: 4 }]
    });

    await expect(session.validate()).resolves.toBeUndefined();
  });
});
