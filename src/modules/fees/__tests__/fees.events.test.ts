import { loadFeeCollectorEvents, parseFeeCollectorEvents } from '../fees.events';
import { BigNumber, Event } from 'ethers';

jest.mock('../fees.events', () => ({
  ...jest.requireActual('../fees.events'),
  loadFeeCollectorEvents: jest.fn(),
}));

describe('events', () => {
  const mockEvents: Event[] = [
    {
      args: [
        '0xTokenAddress',
        '0xIntegratorAddress',
        BigNumber.from(1000),
        BigNumber.from(100),
      ],
    } as unknown as Event,
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
    const rawEvents: Event[] = mockEvents;
    const parsedEvents = parseFeeCollectorEvents(rawEvents);
    expect(parsedEvents).toBeInstanceOf(Array);
    expect(parsedEvents.length).toBe(rawEvents.length);
    expect(parsedEvents[0]).toHaveProperty('token');
    expect(parsedEvents[0]).toHaveProperty('integrator');
    expect(parsedEvents[0]).toHaveProperty('integratorFee');
    expect(parsedEvents[0]).toHaveProperty('lifiFee');
  });
});
