import BlockchainFacade from '../../blockchain/blockchain.facade';
import { ethers } from 'ethers';

jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  providers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getBlockNumber: jest.fn().mockResolvedValue(100),
    })),
  },
  Contract: jest.fn().mockImplementation(() => ({
    filters: {
      FeesCollected: jest.fn().mockReturnValue('filter'),
    },
    queryFilter: jest.fn().mockResolvedValue([]),
  })),
}));

describe('BlockchainFacade', () => {
  it('should load events', async () => {
    const events = await BlockchainFacade.loadEvents(0, 100);
    expect(events).toEqual([]);
  });

  it('should parse event', () => {
    const event = {
      args: ['0xTokenAddress', '0xIntegratorAddress', '1000', '2000'],
    } as unknown as ethers.Event;
    const parsedEvent = BlockchainFacade.parseEvent(event);
    expect(parsedEvent).toEqual({
      token: '0xTokenAddress',
      integrator: '0xIntegratorAddress',
      integratorFee: ethers.BigNumber.from('1000'),
      lifiFee: ethers.BigNumber.from('2000'),
    });
  });
});
