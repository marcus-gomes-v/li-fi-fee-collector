import express from 'express';
import bodyParser from 'body-parser';
import modules from './modules';
import { MongoDBAdapter } from './database/mongoAdapter';

const app = express();

app.use(bodyParser.json());
app.use('/api', modules);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

MongoDBAdapter.getInstance(); // Initialize MongoDB connection

export default app;