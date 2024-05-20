import app from './app';
import { MongoDBAdapter } from './database/mongo.adapter';
import { startEventPolling } from './modules/fees/fees.service';

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const mongoDBAdapter = MongoDBAdapter.getInstance();
    await mongoDBAdapter.connect();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      startEventPolling().catch(error => console.error('Error starting event polling:', error));
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
