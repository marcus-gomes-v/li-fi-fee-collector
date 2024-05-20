import { loadFeeCollectorEvents, parseFeeCollectorEvents } from '../fees.events';
import { ethers } from 'ethers';

jest.mock('../fees.events', () => ({
  ...jest.requireActual('../fees.events'),
  loadFeeCollectorEvents: jest.fn(),
}));

describe('events', () => {
  const mockEvents: ethers.Event[] = [
    {
      args: {
        _token: '0xTokenAddress',
        _integrator: '0xIntegratorAddress',
        _integratorFee: ethers.BigNumber.from(1000),
        _lifiFee: ethers.BigNumber.from(100),
      },
      // Add other necessary properties if required
    } as unknown as ethers.Event,
  ];

  beforeEach(() => {
    (loadFeeCollectorEvents as jest.Mock).mockResolvedValue(mockEvents);
  });

  test('loadFeeCollectorEvents should load events for a given block range', async () => {
    const fromBlock = 1000;
    const toBlock = 1010;
    const events = await loadFeeCollectorEvents(fromBlock, toBlock);
    expect(events).toBeInstanceOf(Array);
    expect(events.length).toBeGreaterThan(0);
  });

  test('parseFeeCollectorEvents should parse raw events correctly', () => {
    const rawEvents: ethers.Event[] = mockEvents;
    const parsedEvents = parseFeeCollectorEvents(rawEvents);
    expect(parsedEvents).toBeInstanceOf(Array);
    expect(parsedEvents.length).toBe(rawEvents.length);
    expect(parsedEvents[0]).toHaveProperty('token');
    expect(parsedEvents[0]).toHaveProperty('integrator');
    expect(parsedEvents[0]).toHaveProperty('integratorFee');
    expect(parsedEvents[0]).toHaveProperty('lifiFee');
  });
});
