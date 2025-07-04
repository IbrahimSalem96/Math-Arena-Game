const amqp = require('amqplib');
const authService = require('../services/auth.service');

const mockCorrelationId = '0.12345';
jest.spyOn(Math, 'random').mockReturnValue(0.12345);

jest.mock('amqplib');

describe('🔐 auth.service.js (Orchestrator)', () => {
  let req, res, mockChannel, mockConn;

  beforeEach(() => {
    req = { body: { username: 'test', password: '123' } };

    res = {
      json: jest.fn()
    };

    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue({ queue: 'replyQueue' }),
      consume: jest.fn((queue, callback) => {
        const msg = {
          content: Buffer.from(JSON.stringify({ success: true })),
          properties: { correlationId: mockCorrelationId }
        };
        process.nextTick(() => callback(msg));
      }),
      sendToQueue: jest.fn()
    };

    mockConn = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn()
    };

    amqp.connect.mockResolvedValue(mockConn);
  });

  describe('register()', () => {
    it('should send register request and return response', async () => {
      await authService.register(req, res);

      expect(amqp.connect).toHaveBeenCalled();
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'auth_rpc',
        expect.any(Buffer),
        expect.objectContaining({
          correlationId: mockCorrelationId,
          replyTo: 'replyQueue'
        })
      );
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('login()', () => {
    it('should send login request and return response', async () => {
      await authService.login(req, res);

      expect(amqp.connect).toHaveBeenCalled();
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'auth_rpc',
        expect.any(Buffer),
        expect.objectContaining({
          correlationId: mockCorrelationId,
          replyTo: 'replyQueue'
        })
      );
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
