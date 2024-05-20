import { BigNumber } from 'ethers';

export interface ParsedFeeCollectedEvents {
  token: string;
  integrator: string;
  integratorFee: BigNumber;
  lifiFee: BigNumber;
  blockNumber: number;
}