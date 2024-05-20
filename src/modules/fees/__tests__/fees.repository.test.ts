import { saveFeeEvents, getFeeEventsByIntegrator } from '../fees.repository';
import { ParsedFeeCollectedEvents } from '../fees.dto';
import { BigNumber, ethers } from 'ethers';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('repository', () => {
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

  test('saveFeeEvents should save events to the database', async () => {
    const events: ParsedFeeCollectedEvents[] = [
      {
        token: '0xTokenAddress',
        integrator: 'example-integrator',
        integratorFee: BigNumber.from(1000),
        lifiFee: BigNumber.from(100),
      },
    ];
    await saveFeeEvents(events);

    const savedEvents = await getFeeEventsByIntegrator('example-integrator', 1, 10);
    expect(savedEvents).toBeInstanceOf(Array);
    expect(savedEvents.length).toBe(1);
    expect(savedEvents[0]).toMatchObject({
      token: '0xTokenAddress',
      integrator: 'example-integrator',
      integratorFee: BigNumber.from(1000),
      lifiFee: BigNumber.from(100),
    });
  });

  test('getFeeEventsByIntegrator should retrieve events for a given integrator', async () => {
    const integrator = 'example-integrator';
    const events = await getFeeEventsByIntegrator(integrator, 1, 10);
    expect(events).toBeInstanceOf(Array);
    expect(events.length).toBe(1);  // Adjust this based on the actual number of events
    expect(events[0]).toHaveProperty('token');
    expect(events[0]).toHaveProperty('integrator');
    expect(events[0]).toHaveProperty('integratorFee');
    expect(events[0]).toHaveProperty('lifiFee');
  });
});
