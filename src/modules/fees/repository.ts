import FeeEventModel from './model';
import { ParsedFeeCollectedEvents } from './dto';

export const saveFeeEvents = async (events: ParsedFeeCollectedEvents[]): Promise<void> => {
  await FeeEventModel.insertMany(events.map(event => ({
    token: event.token,
    integrator: event.integrator,
    integratorFee: event.integratorFee.toString(),
    lifiFee: event.lifiFee.toString(),
  })));
};

export const getFeeEventsByIntegrator = async (integrator: string): Promise<ParsedFeeCollectedEvents[]> => {
  return await FeeEventModel.find({ integrator });
};
