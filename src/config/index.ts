import * as dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/li-fi',
  POLYGON_RPC: process.env.POLYGON_RPC || 'https://polygon-rpc.com',
};
