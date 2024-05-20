import FeeEventModel from './fees.model';
import { ParsedFeeCollectedEvents } from './fees.dto';
import { BigNumber } from 'ethers';

export const saveFeeEvents = async (events: ParsedFeeCollectedEvents[]): Promise<void> => {
  await FeeEventModel.insertMany(events.map(event => ({
    token: event.token,
    integrator: event.integrator,
    integratorFee: event.integratorFee.toString(),
    lifiFee: event.lifiFee.toString(),
  })));
};

export const getFeeEventsByIntegrator = async (
  integrator: string,
  page: number,
  limit: number
): Promise<ParsedFeeCollectedEvents[]> => {
  const skip = (page - 1) * limit;
  const events = await FeeEventModel.find({ integrator }).skip(skip).limit(limit).exec();

  return events.map(event => ({
    token: event.token,
    integrator: event.integrator,
    integratorFee: BigNumber.from(event.integratorFee),
    lifiFee: BigNumber.from(event.lifiFee),
  }));
};