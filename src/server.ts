import app from './app';
import { startEventPolling } from './modules/fees/fees.service';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  startEventPolling().catch(error => console.error('Error starting event polling:', error));
});