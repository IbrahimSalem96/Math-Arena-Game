const mongoose = require('mongoose');
const { register } = require('../services/auth.service');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('register()', () => {
  it('should create user', async () => {
    const result = await register('A', 'uniqueuser_' + Date.now(), '123456');
    expect(result).toHaveProperty('access_token');
    expect(result.message).toMatch(/Hello/);
  }, 15000);
});
