import { ethers } from 'ethers';
import EventFactory from '../fees.event.factory';
import { ParsedFeeCollectedEvents } from '../fees.dto';

describe('Fee Event Factory', () => {
  it('should create a ParsedFeeCollectedEvents object with valid event args', () => {
    const event = createMockEvent([
      '0xTokenAddress',
      '0xIntegratorAddress',
      '1000',
      '2000',
    ]);

    const result: ParsedFeeCollectedEvents = EventFactory.createEvent(event);

    expect(result).toEqual({
      token: '0xTokenAddress',
      integrator: '0xIntegratorAddress',
      integratorFee: ethers.BigNumber.from('1000'),
      lifiFee: ethers.BigNumber.from('2000'),
    });
  });

  it('should throw an error if event.args is undefined', () => {
    const event = createMockEvent(undefined);

    expect(() => EventFactory.createEvent(event)).toThrow('Invalid event args');
  });

  it('should throw an error if event.args has less than 4 elements', () => {
    const event = createMockEvent([
      '0xTokenAddress',
      '0xIntegratorAddress',
    ]);

    expect(() => EventFactory.createEvent(event)).toThrow('Invalid event args');
  });

  it('should throw an error if token is not a string', () => {
    const event = createMockEvent([
      123,
      '0xIntegratorAddress',
      '1000',
      '2000',
    ]);

    expect(() => EventFactory.createEvent(event)).toThrow('Invalid event arg types');
  });

  it('should throw an error if integrator is not a string', () => {
    const event = createMockEvent([
      '0xTokenAddress',
      123,
      '1000',
      '2000',
    ]);

    expect(() => EventFactory.createEvent(event)).toThrow('Invalid event arg types');
  });

  it('should create a ParsedFeeCollectedEvents object with BigNumber inputs', () => {
    const event = createMockEvent([
      '0xTokenAddress',
      '0xIntegratorAddress',
      ethers.BigNumber.from('1000'),
      ethers.BigNumber.from('2000'),
    ]);

    const result: ParsedFeeCollectedEvents = EventFactory.createEvent(event);

    expect(result).toEqual({
      token: '0xTokenAddress',
      integrator: '0xIntegratorAddress',
      integratorFee: ethers.BigNumber.from('1000'),
      lifiFee: ethers.BigNumber.from('2000'),
    });
  });
});

// Helper function to create a mock ethers.Event
function createMockEvent(args: any[] | undefined): ethers.Event {
  return {
    args: args,
    removeListener: jest.fn(),
    getBlock: jest.fn(),
    getTransaction: jest.fn(),
    getTransactionReceipt: jest.fn(),
    event: "",
    eventSignature: "",
    address: "",
    logIndex: 0,
    transactionIndex: 0,
    transactionHash: "",
    blockHash: "",
    blockNumber: 0,
    getBlockNumber: jest.fn(),
    decode: jest.fn(),
    getTransactionResult: jest.fn(),
    decodeError: jest.fn()
  } as unknown as ethers.Event;
}