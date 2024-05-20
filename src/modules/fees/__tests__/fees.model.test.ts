import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import FeeEventModel from '../fees.model'; // Adjust the path according to your structure

describe('FeeEvent Model Test', () => {
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

  it('should create a new fee event', async () => {
    const feeEvent = new FeeEventModel({
      token: '0xTokenAddress',
      integrator: '0xIntegratorAddress',
      integratorFee: '1000',
      lifiFee: '2000',
      blockNumber: 1000,
    });

    const savedFeeEvent = await feeEvent.save();
    expect(savedFeeEvent._id).toBeDefined();
    expect(savedFeeEvent.token).toBe('0xTokenAddress');
    expect(savedFeeEvent.integrator).toBe('0xIntegratorAddress');
    expect(savedFeeEvent.integratorFee).toBe('1000');
    expect(savedFeeEvent.lifiFee).toBe('2000');
    expect(savedFeeEvent.blockNumber).toBe(1000);
  });
});