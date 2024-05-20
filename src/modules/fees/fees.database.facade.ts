import FeeEventModel from './fees.model';
import { ParsedFeeCollectedEvents } from './fees.dto';

class DatabaseFacade {
  async saveEvents(events: ParsedFeeCollectedEvents[]): Promise<void> {
    await FeeEventModel.insertMany(events.map(event => ({
      token: event.token,
      integrator: event.integrator,
      integratorFee: event.integratorFee.toString(),
      lifiFee: event.lifiFee.toString(),
    })));
  }

  async getEventsByIntegrator(integrator: string): Promise<ParsedFeeCollectedEvents[]> {
    return await FeeEventModel.find({ integrator });
  }
}

export default new DatabaseFacade();