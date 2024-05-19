import request from 'supertest';
import app from '../app';
import { MongoDBAdapter } from '../database/mongoAdapter';

describe('GET /', () => {
  beforeAll(async () => {
    await MongoDBAdapter.getInstance(); // Ensure MongoDB is connected before tests
  });

  afterAll(async () => {
    await MongoDBAdapter.getInstance().disconnect(); // Ensure MongoDB is disconnected after tests
  });

  it('should return Hello, World!', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello, World!');
  });
});
