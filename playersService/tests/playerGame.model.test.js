const PlayerGame = require('../models/playerGame.model');

describe('🎯 PlayerGame Model', () => {
  it('should require playerId and gameSessionId', async () => {
    const pg = new PlayerGame({});
    try {
      await pg.validate();
    } catch (err) {
      expect(err.errors.playerId).toBeDefined();
      expect(err.errors.gameSessionId).toBeDefined();
    }
  });

  it('should accept answers array', async () => {
    const pg = new PlayerGame({
      playerId: '507f1f77bcf86cd799439011',
      gameSessionId: '507f1f77bcf86cd799439012',
      answers: [
        {
          question: '5 + 2',
          playerAnswer: 7,
          correctAnswer: 7,
          timeTaken: 3
        }
      ],
      score: 1,
      totalTimeSpent: 3
    });
    await expect(pg.validate()).resolves.toBeUndefined();
  });
});
