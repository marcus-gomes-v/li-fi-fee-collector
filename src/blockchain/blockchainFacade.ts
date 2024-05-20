import { ethers } from 'ethers';
import config from '../config';
import { Web3Provider } from '../utils/web3';
import FeeCollector__factory from '../contracts/FeeCollector__factory';
import EventFactory from '../modules/fees/fees.event.factory';

class BlockchainFacade {
  private provider: ethers.providers.JsonRpcProvider;
  private feeCollector: ethers.Contract;

  constructor() {
    this.provider = Web3Provider.getInstance();
    this.feeCollector = FeeCollector__factory.connect(config.CONTRACT_ADDRESS, this.provider);
  }

  async loadEvents(fromBlock: number, toBlock: number): Promise<ethers.Event[]> {
    const filter = this.feeCollector.filters.FeesCollected();
    return await this.feeCollector.queryFilter(filter, fromBlock, toBlock);
  }

  parseEvent(event: ethers.Event) {
    return EventFactory.createEvent(event);
  }
}

export default new BlockchainFacade();