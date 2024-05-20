import { getLastProcessedBlock, createOrUpdateBlock } from '../blocks.repository';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Blocks Repository', () => {
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

  test('getLastProcessedBlock should return the last processed block number', async () => {
    const blockNumber = await getLastProcessedBlock();
    expect(blockNumber).toBeNull();
  });

  test('createOrUpdateBlock should create a new block if it does not exist', async () => {
    await createOrUpdateBlock(123456, 10);
    const blockNumber = await getLastProcessedBlock();
    expect(blockNumber).toBe(123456);
  });

  test('createOrUpdateBlock should update an existing block', async () => {
    await createOrUpdateBlock(123456, 10);
    await createOrUpdateBlock(123456, 20);
    const blockNumber = await getLastProcessedBlock();
    expect(blockNumber).toBe(123456);
  })

  
});
