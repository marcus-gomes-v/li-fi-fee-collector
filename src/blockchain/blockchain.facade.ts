import { ethers } from 'ethers';
import config from '../config';
import { Web3Provider } from '../utils/web3';
import FeeCollector__factory from '../contracts/fee.collector.factory';
import EventFactory from '../modules/fees/fees.event.factory';

class BlockchainFacade {
  private provider: ethers.providers.JsonRpcProvider;
  private feeCollector: ethers.Contract;

  constructor() {
    this.provider = Web3Provider.getInstance();
    this.feeCollector = FeeCollector__factory.connect(config.CONTRACT_ADDRESS, this.provider);
  }

  async loadEvents(fromBlock: number, toBlock: number): Promise<ethers.Event[]> {
    try {
      const filter = this.feeCollector.filters.FeesCollected();
      return await this.feeCollector.queryFilter(filter, fromBlock, toBlock);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error loading events from blockchain:', error.message);
        throw new Error(`Error loading events: ${error.message}`);
      } else {
        console.error('Unknown error loading events from blockchain:', error);
        throw new Error('Unknown error loading events');
      }
    }
  }

  parseEvent(event: ethers.Event) {
    try {
      return EventFactory.createEvent(event);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error parsing event:', error.message);
        throw new Error(`Error parsing event: ${error.message}`);
      } else {
        console.error('Unknown error parsing event:', error);
        throw new Error('Unknown error parsing event');
      }
    }
  }
}

export default new BlockchainFacade();