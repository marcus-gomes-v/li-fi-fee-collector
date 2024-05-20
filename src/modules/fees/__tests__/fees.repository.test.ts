import { saveFeeEvents, getFeeEventsByIntegrator } from '../fees.repository';
import { ParsedFeeCollectedEvents } from '../fees.dto';

describe('repository', () => {
  test('saveFeeEvents should save events to the database', async () => {
    const events: ParsedFeeCollectedEvents[] = [
      // Add sample parsed events here
    ];
    await saveFeeEvents(events);
    // Assert that the events are saved correctly in the database
  });

  test('getFeeEventsByIntegrator should retrieve events for a given integrator', async () => {
    const integrator = 'example-integrator';
    const events = await getFeeEventsByIntegrator(integrator);
    expect(events).toBeInstanceOf(Array);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('token');
    expect(events[0]).toHaveProperty('integrator');
    expect(events[0]).toHaveProperty('integratorFee');
    expect(events[0]).toHaveProperty('lifiFee');
  });
});