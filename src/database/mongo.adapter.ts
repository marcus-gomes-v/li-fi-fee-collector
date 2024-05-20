import mongoose from 'mongoose';
import config from '../config';
import FeeEventModel from '../modules/fees/fees.model'; 
import { BlockModel } from '../modules/blocks/blocks.model'; 

export class MongoDBAdapter {
  private static instance: MongoDBAdapter;

  private constructor() { }

  public static getInstance(): MongoDBAdapter {
    if (!MongoDBAdapter.instance) {
      MongoDBAdapter.instance = new MongoDBAdapter();
      MongoDBAdapter.instance.connect();
    }
    return MongoDBAdapter.instance;
  }

  private async connect() {
    try {
      await mongoose.connect(config.MONGO_URI);
      console.log('MongoDB connected');

      // Ensure indexes are created
      await FeeEventModel.ensureIndexes();
      await BlockModel.ensureIndexes();
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

  public async disconnect() {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}