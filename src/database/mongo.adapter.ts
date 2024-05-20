import mongoose from 'mongoose';
import config from '../config';
import FeeEventModel from '../modules/fees/fees.model';
import { BlockModel } from '../modules/blocks/blocks.model';

export class MongoDBAdapter {
  private static instance: MongoDBAdapter;
  private connected: boolean = false;

  private constructor() { }

  public static getInstance(): MongoDBAdapter {
    if (!MongoDBAdapter.instance) {
      MongoDBAdapter.instance = new MongoDBAdapter();
    }
    return MongoDBAdapter.instance;
  }

  public async connect(uri: string = config.MONGO_URI) {
    try {
      await mongoose.connect(uri);
      this.connected = true;
      await FeeEventModel.ensureIndexes();
      await BlockModel.ensureIndexes();
    } catch (error) {
      throw new Error('MongoDB connection error');
    }
  }

  public async disconnect() {
    if (this.connected) {
      await mongoose.disconnect();
      this.connected = false;
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}
