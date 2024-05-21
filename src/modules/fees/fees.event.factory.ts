import { ethers } from "ethers";
import { ParsedFeeCollectedEvents } from "./fees.dto";

class EventFactory {
  static createEvent(event: ethers.Event): ParsedFeeCollectedEvents {
    if (!event.args || event.args.length < 4) {
      throw new Error("Invalid event args");
    }

    const [token, integrator, integratorFee, lifiFee] = event.args;

    if (typeof token !== "string" || typeof integrator !== "string") {
      throw new Error("Invalid event arg types");
    }

    return {
      token,
      integrator,
      integratorFee: ethers.BigNumber.from(integratorFee),
      lifiFee: ethers.BigNumber.from(lifiFee),
      blockNumber: event.blockNumber // Add this line
    };
  }
}

export default EventFactory;