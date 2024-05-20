import { ethers } from 'ethers';
import config from '../../config';
import { FeeCollector__factory } from 'lifi-contract-typings';
import { ParsedFeeCollectedEvents } from './fees.dto';

export const loadFeeCollectorEvents = async (fromBlock: ethers.providers.BlockTag, toBlock: ethers.providers.BlockTag): Promise<ethers.Event[]> => {
  const provider = new ethers.providers.JsonRpcProvider(config.POLYGON_RPC);
  const feeCollector = FeeCollector__factory.connect(config.CONTRACT_ADDRESS, provider);
  const filter = feeCollector.filters.FeesCollected();
  return await feeCollector.queryFilter(filter, fromBlock, toBlock);
};

export const parseFeeCollectorEvents = (events: ethers.Event[]): ParsedFeeCollectedEvents[] => {
  return events.map(event => {
    if (!event.args || event.args.length < 4) {
      throw new Error(`Invalid event args: ${JSON.stringify(event)}`);
    }

    const [token, integrator, integratorFee, lifiFee] = event.args;

    if (typeof token !== 'string' || typeof integrator !== 'string') {
      throw new Error(`Invalid event arg types: ${JSON.stringify(event.args)}`);
    }

    return {
      token,
      integrator,
      integratorFee: ethers.BigNumber.from(integratorFee),
      lifiFee: ethers.BigNumber.from(lifiFee),
      blockNumber: event.blockNumber // Add this line
    };
  });
};
