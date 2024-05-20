import * as dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/li-fi',
  POLYGON_RPC: process.env.POLYGON_RPC || 'https://polygon-rpc.com',
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9',
  POLL_INTERVAL: parseInt(process.env.POLL_INTERVAL || '60000', 10),
  BLOCK_CHUNK_SIZE: parseInt(process.env.BLOCK_CHUNK_SIZE || '500', 10),
  INITIAL_BLOCK: parseInt(process.env.INITIAL_BLOCK || '47961368', 10)
};
