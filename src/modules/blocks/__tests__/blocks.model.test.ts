import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BlockModel } from '../blocks.model';

describe('BlockModel Model Test', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a new block', async () => {
    const block = new BlockModel({
      number: 123456,
      eventCount: 10,
    });
    
    const savedBlock = await block.save();
    expect(savedBlock._id).toBeDefined();
    expect(savedBlock.number).toBe(123456);
    expect(savedBlock.eventCount).toBe(10);
  });
});