import app from './app';
import { MongoDBAdapter } from './database/mongoAdapter';

const port = process.env.PORT || 3000;

MongoDBAdapter.getInstance();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
