const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /auth/register', () => {
  it('should return token on success', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'A',
        username: 'user_' + Date.now(),
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('access_token');
  });
});
