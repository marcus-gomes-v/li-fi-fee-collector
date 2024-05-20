import request from 'supertest';
import app from '../app';
import { MongoDBAdapter } from '../database/mongo.adapter';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('GET /', () => {
  let mongoServer: MongoMemoryServer;
  let mongoDBAdapter: MongoDBAdapter;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mongoDBAdapter = MongoDBAdapter.getInstance();
    await mongoDBAdapter.connect(uri);

    while (!mongoDBAdapter.isConnected()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  });

  afterAll(async () => {
    await mongoDBAdapter.disconnect();
    await mongoServer.stop();
  });

  it('should return Hello, World!', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello, World!');
  });
});
