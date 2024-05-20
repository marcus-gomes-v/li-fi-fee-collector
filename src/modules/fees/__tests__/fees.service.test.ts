import { fetchAndStoreFeeEvents, retrieveEventsForIntegrator, startEventPolling } from '../fees.service';
import { loadFeeCollectorEvents, parseFeeCollectorEvents } from '../fees.events';
import { saveFeeEvents, getFeeEventsByIntegrator } from '../fees.repository';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BigNumber } from 'ethers';

jest.mock('../fees.events');
jest.mock('../fees.repository');

describe('Fee Service', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and store fee events', async () => {
    const mockEvents = [{ /* mock event data */ }];
    (loadFeeCollectorEvents as jest.Mock).mockResolvedValue(mockEvents);
    (parseFeeCollectorEvents as jest.Mock).mockReturnValue(mockEvents);

    await fetchAndStoreFeeEvents(0, 100);

    expect(loadFeeCollectorEvents).toHaveBeenCalledWith(0, 100);
    expect(parseFeeCollectorEvents).toHaveBeenCalledWith(mockEvents);
    expect(saveFeeEvents).toHaveBeenCalledWith(mockEvents);
  }, 20000); // Increase timeout to 20 seconds

  it('should retrieve events for an integrator', async () => {
    const mockEvents = [
      {
        token: '0xTokenAddress',
        integrator: 'test-integrator',
        integratorFee: BigNumber.from('1000'),
        lifiFee: BigNumber.from('2000'),
      },
    ];
    (getFeeEventsByIntegrator as jest.Mock).mockResolvedValue(mockEvents);

    const events = await retrieveEventsForIntegrator('test-integrator', 1, 10);

    expect(getFeeEventsByIntegrator).toHaveBeenCalledWith('test-integrator', 1, 10);
    expect(events).toEqual(
      mockEvents.map(event => ({
        token: event.token,
        integrator: event.integrator,
        integratorFee: BigNumber.from(event.integratorFee),
        lifiFee: BigNumber.from(event.lifiFee),
      }))
    );
  });
});
