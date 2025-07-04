const gameService = require('../services/game.service');

describe('game.service', () => {
  test('startGame should call sendToGameQueue and return response', async () => {
    const mockResponse = { question: '2 + 2', submit_url: '/game/abc/submit' };
    gameService.sendToGameQueue = jest.fn().mockResolvedValue(mockResponse);

    const response = await gameService.sendToGameQueue({ name: 'Test', difficulty: 'easy' }, 'start');
    expect(response).toEqual(mockResponse);
  });
});
