import { BigNumber, providers } from "ethers";
import config from "../../config";
import { loadFeeCollectorEvents, parseFeeCollectorEvents } from "./fees.events";
import { saveFeeEvents, getFeeEventsByIntegrator } from "./fees.repository";
import { getLastProcessedBlock, createOrUpdateBlock } from "../blocks/blocks.repository";
import { ParsedFeeCollectedEvents } from "./fees.dto";

export const fetchAndStoreFeeEvents = async (fromBlock: number, toBlock: number): Promise<void> => {
  try {
    let currentFromBlock = fromBlock;
    while (currentFromBlock <= toBlock) {
      const currentToBlock = Math.min(currentFromBlock + config.BLOCK_CHUNK_SIZE - 1, toBlock);
      const events = await loadFeeCollectorEvents(currentFromBlock, currentToBlock);
      const parsedEvents = parseFeeCollectorEvents(events);
      await saveFeeEvents(parsedEvents);
      for (let blockNumber = currentFromBlock; blockNumber <= currentToBlock; blockNumber++) {
        const blockEvents = events.filter(event => event.blockNumber === blockNumber);
        await createOrUpdateBlock(blockNumber, blockEvents.length);
      }
      currentFromBlock = currentToBlock + 1;
    }
  } catch (error) {
    console.error("Error fetching and storing fee events:", error);
    throw error;
  }
};

export const startEventPolling = async (): Promise<void> => {
  try {
    let lastProcessedBlock = await getLastProcessedBlock();
    if (lastProcessedBlock === null) {
      lastProcessedBlock = config.INITIAL_BLOCK;
    } else if (lastProcessedBlock > config.INITIAL_BLOCK) {
      console.log(`Found a higher block (${lastProcessedBlock}). Starting from that block.`);
    } else {
      lastProcessedBlock = config.INITIAL_BLOCK;
    }

    const fetchEvents = async () => {
      try {
        const latestBlock = await getLatestBlockNumber();
        if (latestBlock > lastProcessedBlock!) {
          await fetchAndStoreFeeEvents(lastProcessedBlock! + 1, latestBlock);
          lastProcessedBlock = latestBlock;
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    setInterval(fetchEvents, config.POLL_INTERVAL);
    await fetchEvents(); // Fetch immediately on startup
  } catch (error) {
    console.error("Error starting event polling:", error);
  }
};

export const retrieveEventsForIntegrator = async (
  integrator: string,
  page: number,
  limit: number
): Promise<ParsedFeeCollectedEvents[]> => {
  const events = await getFeeEventsByIntegrator(integrator, page, limit);

  return events.map(event => ({
    token: event.token,
    integrator: event.integrator,
    integratorFee: BigNumber.from(event.integratorFee),
    lifiFee: BigNumber.from(event.lifiFee),
    blockNumber: event.blockNumber
  }));
};

const getLatestBlockNumber = async (): Promise<number> => {
  const provider = new providers.JsonRpcProvider(config.POLYGON_RPC);
  return provider.getBlockNumber();
};