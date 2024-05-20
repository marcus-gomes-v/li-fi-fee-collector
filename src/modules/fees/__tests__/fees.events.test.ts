import { loadFeeCollectorEvents, parseFeeCollectorEvents } from '../fees.events';
import { ethers } from 'ethers';

describe('events', () => {
  test('loadFeeCollectorEvents should load events for a given block range', async () => {
    const fromBlock = 1000;
    const toBlock = 1010;
    const events = await loadFeeCollectorEvents(fromBlock, toBlock);
    expect(events).toBeInstanceOf(Array);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toBeInstanceOf(ethers.Event);
  });

  test('parseFeeCollectorEvents should parse raw events correctly', () => {
    const rawEvents: ethers.Event[] = [
      // Add sample raw events here
    ];
    const parsedEvents = parseFeeCollectorEvents(rawEvents);
    expect(parsedEvents).toBeInstanceOf(Array);
    expect(parsedEvents.length).toBe(rawEvents.length);
    expect(parsedEvents[0]).toHaveProperty('token');
    expect(parsedEvents[0]).toHaveProperty('integrator');
    expect(parsedEvents[0]).toHaveProperty('integratorFee');
    expect(parsedEvents[0]).toHaveProperty('lifiFee');
  });
});