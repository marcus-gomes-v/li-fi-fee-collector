import { ethers } from 'ethers';
import config from '../config';

class Web3Provider {
  private static instance: ethers.providers.JsonRpcProvider;

  private constructor() { }

  public static getInstance(): ethers.providers.JsonRpcProvider {
    if (!Web3Provider.instance) {
      Web3Provider.instance = new ethers.providers.JsonRpcProvider(config.POLYGON_RPC);
    }
    return Web3Provider.instance;
  }
}

export { Web3Provider };
