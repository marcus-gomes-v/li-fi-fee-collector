import BlockchainFacade from '../../../blockchain/blockchain.facade';
import DatabaseFacade from '../fees.database.facade';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BigNumber } from 'ethers';

describe('Blockchain and Database Facades', () => {
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

  it('should load and parse events from the blockchain', async () => {
    const events = await BlockchainFacade.loadEvents(0, 100);
    const parsedEvents = events.map(event => BlockchainFacade.parseEvent(event));
    expect(parsedEvents).toBeDefined();
  });

  it('should save and retrieve events from the database', async () => {
    const events = [
      {
        token: '0xTokenAddress',
        integrator: '0xIntegratorAddress',
        integratorFee: BigNumber.from('1000'),
        lifiFee: BigNumber.from('2000'),
      },
    ];
    await DatabaseFacade.saveEvents(events);
    const retrievedEvents = await DatabaseFacade.getEventsByIntegrator('0xIntegratorAddress');
    expect(retrievedEvents.length).toBe(1);
    expect(retrievedEvents[0].token).toBe('0xTokenAddress');
  });
});