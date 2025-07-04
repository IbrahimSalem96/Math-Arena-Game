const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const playerService = require('../services/player.service');

// 🔁 Mock amqplib & uuid
jest.mock('amqplib');
jest.mock('uuid', () => ({
  v4: () => 'mock-id'
}));

describe('🎯 player.service.js (Orchestrator)', () => {
  let req, res, mockChannel, mockConn;

  beforeEach(() => {
    req = {
      params: {},
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue({ queue: 'replyQueue' }),
      consume: jest.fn((queue, callback) => {
        const msg = {
          content: Buffer.from(JSON.stringify({ success: true })),
          properties: { correlationId: 'mock-id' } // 🧠 نفس uuid الموك
        };
        process.nextTick(() => callback(msg)); // 🔄 يحاكي الاستلام الفوري
      }),
      sendToQueue: jest.fn()
    };

    mockConn = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn()
    };

    amqp.connect.mockResolvedValue(mockConn);
  });

  describe('getPlayerResult()', () => {
    it('should return player result if playerId is valid', async () => {
      req.params.playerId = 'player123';

      await playerService.getPlayerResult(req, res);

      expect(amqp.connect).toHaveBeenCalled();
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'players_rpc',
        expect.any(Buffer),
        expect.objectContaining({
          correlationId: 'mock-id',
          replyTo: 'replyQueue'
        })
      );
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return 400 if playerId is missing', async () => {
      req.params.playerId = null;

      await playerService.getPlayerResult(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing player ID' });
    });
  });

  describe('getGameResult()', () => {
    it('should return game result if gameId is valid', async () => {
      req.params.gameId = 'game456';

      await playerService.getGameResult(req, res);

      expect(amqp.connect).toHaveBeenCalled();
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'players_rpc',
        expect.any(Buffer),
        expect.objectContaining({
          correlationId: 'mock-id',
          replyTo: 'replyQueue'
        })
      );
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return 400 if gameId is missing', async () => {
      req.params.gameId = null;

      await playerService.getGameResult(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing game ID' });
    });
  });
});
