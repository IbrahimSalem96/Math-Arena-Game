const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/auth.middleware');
jest.mock('jsonwebtoken');

describe('🔐 Auth Middleware', () => {
  it('should call next() if token is valid', () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer valid.token' }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => ({ id: '123' }));

    verifyToken(req, res, next);

    expect(req.user).toEqual({ id: '123' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is missing', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Missing or malformed token' });
  });

  it('should return 403 if token is invalid', () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer invalid.token' }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    verifyToken(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ error: 'Invalid token' });
  });
});
