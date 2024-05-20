import { fetchAndStoreFeeEvents, retrieveEventsForIntegrator } from '../fees.service';
import { loadFeeCollectorEvents, parseFeeCollectorEvents } from '../fees.events';
import { saveFeeEvents, getFeeEventsByIntegrator } from '../fees.repository';

jest.mock('../events');
jest.mock('../repository');

describe('Fee Service', () => {
  beforeEach(() => {
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
  });

  it('should retrieve events for an integrator', async () => {
    const mockEvents = [{ /* mock event data */ }];
    (getFeeEventsByIntegrator as jest.Mock).mockResolvedValue(mockEvents);

    const events = await retrieveEventsForIntegrator('test-integrator');

    expect(getFeeEventsByIntegrator).toHaveBeenCalledWith('test-integrator');
    expect(events).toEqual(mockEvents);
  });
});
