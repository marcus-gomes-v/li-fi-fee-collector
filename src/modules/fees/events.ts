import { ethers } from 'ethers';
import config from '../../config';
import { FeeCollector__factory } from 'lifi-contract-typings'; 
import { ParsedFeeCollectedEvents } from './dto';

export const loadFeeCollectorEvents = async (fromBlock: ethers.providers.BlockTag, toBlock: ethers.providers.BlockTag): Promise<ethers.Event[]> => {
  const provider = new ethers.providers.JsonRpcProvider(config.POLYGON_RPC);
  const feeCollector = FeeCollector__factory.connect(config.CONTRACT_ADDRESS, provider);
  const filter = feeCollector.filters.FeesCollected();
  return await feeCollector.queryFilter(filter, fromBlock, toBlock);
};

export const parseFeeCollectorEvents = (events: ethers.Event[]): ParsedFeeCollectedEvents[] => {
  return events.map(event => {
    const parsedEvent = event.decode ? event.decode(event.data, event.topics) : null;
    return {
      token: parsedEvent?.token,
      integrator: parsedEvent?.integrator,
      integratorFee: parsedEvent?.integratorFee,
      lifiFee: parsedEvent?.lifiFee,
    };
  });
};
