import { fetchAndStoreFeeEvents, retrieveEventsForIntegrator } from "../fees.service";
import { loadFeeCollectorEvents, parseFeeCollectorEvents } from "../fees.events";
import { saveFeeEvents, getFeeEventsByIntegrator } from "../fees.repository";
import { createOrUpdateBlock } from "../../blocks/blocks.repository";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BigNumber } from "ethers";
import { ParsedFeeCollectedEvents } from "../fees.dto";

jest.mock("../fees.events");
jest.mock("../fees.repository");
jest.mock("../../blocks/blocks.repository");
jest.mock("ethers", () => ({
  ...jest.requireActual("ethers"),
  providers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getBlockNumber: jest.fn().mockResolvedValue(200),
    })),
  },
}));

describe("Fee Service", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should fetch and store fee events", async () => {
    const mockEvents: ParsedFeeCollectedEvents[] = [{
      token: "0xTokenAddress",
      integrator: "test-integrator",
      integratorFee: BigNumber.from("1000"),
      lifiFee: BigNumber.from("2000"),
      blockNumber: 12345
    }];
    (loadFeeCollectorEvents as jest.Mock).mockResolvedValue(mockEvents);
    (parseFeeCollectorEvents as jest.Mock).mockReturnValue(mockEvents);

    await fetchAndStoreFeeEvents(0, 2);

    expect(loadFeeCollectorEvents).toHaveBeenCalledWith(0, 2);
    expect(parseFeeCollectorEvents).toHaveBeenCalledWith(mockEvents);
    expect(saveFeeEvents).toHaveBeenCalledWith(mockEvents);

    expect(createOrUpdateBlock).toHaveBeenNthCalledWith(1, 0, 0);
    expect(createOrUpdateBlock).toHaveBeenNthCalledWith(2, 1, 0);
  }, 20000);

  it("should handle errors during fetching and storing fee events", async () => {
    const error = new Error("Failed to load events");
    (loadFeeCollectorEvents as jest.Mock).mockRejectedValue(error);

    console.error = jest.fn();

    await expect(fetchAndStoreFeeEvents(0, 100)).rejects.toThrow("Failed to load events");
    expect(console.error).toHaveBeenCalledWith("Error fetching and storing fee events:", error);
  });

  it("should retrieve events for an integrator", async () => {
    const mockEvents: ParsedFeeCollectedEvents[] = [
      {
        token: "0xTokenAddress",
        integrator: "test-integrator",
        integratorFee: BigNumber.from("1000"),
        lifiFee: BigNumber.from("2000"),
        blockNumber: 12345
      },
    ];
    (getFeeEventsByIntegrator as jest.Mock).mockResolvedValue(mockEvents);

    const events = await retrieveEventsForIntegrator("test-integrator", 1, 10);

    expect(getFeeEventsByIntegrator).toHaveBeenCalledWith("test-integrator", 1, 10);
    expect(events).toEqual(mockEvents);
  });

  it("should create and update blocks with events correctly", async () => {
    const mockEvents: ParsedFeeCollectedEvents[] = [
      {
        token: "0xTokenAddress1",
        integrator: "test-integrator",
        integratorFee: BigNumber.from("1000"),
        lifiFee: BigNumber.from("2000"),
        blockNumber: 0
      },
      {
        token: "0xTokenAddress2",
        integrator: "test-integrator",
        integratorFee: BigNumber.from("1000"),
        lifiFee: BigNumber.from("2000"),
        blockNumber: 1
      }
    ];
    (loadFeeCollectorEvents as jest.Mock).mockResolvedValue(mockEvents);
    (parseFeeCollectorEvents as jest.Mock).mockReturnValue(mockEvents);

    await fetchAndStoreFeeEvents(0, 1);

    expect(loadFeeCollectorEvents).toHaveBeenCalledWith(0, 1);
    expect(parseFeeCollectorEvents).toHaveBeenCalledWith(mockEvents);
    expect(saveFeeEvents).toHaveBeenCalledWith(mockEvents);

    expect(createOrUpdateBlock).toHaveBeenNthCalledWith(1, 0, 1);
    expect(createOrUpdateBlock).toHaveBeenNthCalledWith(2, 1, 1);
  });

  it("should create and update blocks with no events correctly", async () => {
    const mockEvents: ParsedFeeCollectedEvents[] = [];
    (loadFeeCollectorEvents as jest.Mock).mockResolvedValue(mockEvents);
    (parseFeeCollectorEvents as jest.Mock).mockReturnValue(mockEvents);

    await fetchAndStoreFeeEvents(0, 1);

    expect(loadFeeCollectorEvents).toHaveBeenCalledWith(0, 1);
    expect(parseFeeCollectorEvents).toHaveBeenCalledWith(mockEvents);
    expect(saveFeeEvents).toHaveBeenCalledWith(mockEvents);

    expect(createOrUpdateBlock).toHaveBeenNthCalledWith(1, 0, 0);
    expect(createOrUpdateBlock).toHaveBeenNthCalledWith(2, 1, 0);
  });

});
