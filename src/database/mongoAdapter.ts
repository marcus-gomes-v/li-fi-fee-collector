import mongoose from 'mongoose';
import config from '../config';

class MongoDBAdapter {
  private static instance: MongoDBAdapter;

  private constructor() {
    this.connect();
  }

  public static getInstance(): MongoDBAdapter {
    if (!MongoDBAdapter.instance) {
      MongoDBAdapter.instance = new MongoDBAdapter();
    }
    return MongoDBAdapter.instance;
  }

  private async connect() {
    try {
      await mongoose.connect(config.MONGO_URI);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }
}

export { MongoDBAdapter };
