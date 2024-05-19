import { BigNumber } from '@ethersproject/bignumber';

export interface ParsedFeeCollectedEvents {
  token: string;
  integrator: string;
  integratorFee: BigNumber;
  lifiFee: BigNumber;
}