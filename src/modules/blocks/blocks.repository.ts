import { BlockModel } from './blocks.model';

export const getLastProcessedBlock = async (): Promise<number | null> => {
  const block = await BlockModel.findOne().sort({ number: -1 });
  return block ? block.number : null;
};

export const createOrUpdateBlock = async (blockNumber: number, eventCount: number): Promise<void> => {
  await BlockModel.findOneAndUpdate(
    { number: blockNumber },
    { $inc: { eventCount } },
    { upsert: true }
  );
};