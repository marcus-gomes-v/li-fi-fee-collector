import { loadFeeCollectorEvents, parseFeeCollectorEvents } from './events';
import { saveFeeEvents, getFeeEventsByIntegrator } from './repository';

export const fetchAndStoreFeeEvents = async (fromBlock: number, toBlock: number): Promise<void> => {
  const events = await loadFeeCollectorEvents(fromBlock, toBlock);
  const parsedEvents = parseFeeCollectorEvents(events);
  await saveFeeEvents(parsedEvents);
};

export const retrieveEventsForIntegrator = async (integrator: string) => {
  return await getFeeEventsByIntegrator(integrator);
};
